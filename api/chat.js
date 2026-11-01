// 💬 かぞくチャット。書いた ことは かぞく みんなに 見える。けすのは 保護者だけ。
//   GET            : 新しい じゅんに 100こまで（?since=<t> で それより あたらしい ものだけ）
//   POST add       : { action:'add', who, text } か { action:'add', who, stamp } … text は 1〜200文字
//   POST del       : { action:'del', id, token } … 保護者の 合言葉（ANRINO_EDIT_TOKEN）が 要る
// 会話は Redis（リポジトリの そと）に おく。本番いがいは べつの リストに 書く（本番を よごさない）
// 子どもが 書いたら、保護者へ メールでも しらせる（1分に 1通まで。本番だけ）
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { allowOrigin, rateLimit, checkToken, redis } = require('./_guard');
const { PARENTS } = require('./_mail');

const PROD = process.env.VERCEL_ENV === 'production';
const KEY = PROD ? 'chat:list' : 'chat:test:list';
const KEEP = 500;
const SHOW = 100;
const MAX_LEN = 200;
const WHO = ['anri', 'rino', 'mitsuki', 'kensuke', 'yusei'];
const NAME = { anri: 'あんり', rino: 'りの', mitsuki: 'みつき', kensuke: 'けんすけ', yusei: 'ゆうせい' };
const STAMPS = ['👍', '❤️', '😂', '🙏', '🎉', '🍙'];
const SITE = 'https://ena-quiz.vercel.app/';

const parse = (s) => { try { return JSON.parse(s); } catch (e) { return null; } };

async function notify(item) {
  const to = Object.entries(PARENTS).filter(([w]) => w !== item.who).map(([, a]) => a);
  if (!to.length) return;
  const body = item.stamp || [...item.text].slice(0, 40).join('');
  if (!PROD) { console.log('chat mail (skipped, not production):', NAME[item.who], body); return; }
  const first = await redis(['SET', `chat:mail:${item.who}`, '1', 'NX', 'EX', 60]);
  if (first !== 'OK') return;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
  for (const addr of to) {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: addr,
      subject: `ANRINO：${NAME[item.who]}からメッセージ`,
      text: `${NAME[item.who]}：${body}\n\nアプリをひらく：${SITE}`,
    });
  }
}

module.exports = async function handler(req, res) {
  if (!allowOrigin(req, res, 'GET, POST')) return;
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      if (!(await rateLimit(req, res, 'chat-get', 120, 60))) return;
      const raw = (await redis(['LRANGE', KEY, 0, SHOW - 1])) || [];
      const since = Number(req.query && req.query.since) || 0;
      return res.json({ items: raw.map(parse).filter((x) => x && x.t > since) });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

    const body = typeof req.body === 'string' ? parse(req.body) || {} : req.body || {};

    if (body.action === 'add') {
      if (!(await rateLimit(req, res, 'chat', 30, 60))) return;
      if (!WHO.includes(body.who)) return res.status(400).json({ error: 'who' });
      const item = { id: crypto.randomBytes(6).toString('hex'), t: Date.now(), who: body.who };
      if (body.stamp) {
        if (!STAMPS.includes(body.stamp)) return res.status(400).json({ error: 'stamp' });
        item.stamp = body.stamp;
      } else {
        // 見えない 文字は けす・改行は 2つまで
        const text = String(body.text || '')
          .replace(/[\u0000-\u0009\u000b-\u001f\u007f​-‏‪-‮]/g, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        if (!text) return res.status(400).json({ error: 'empty' });
        if ([...text].length > MAX_LEN) return res.status(400).json({ error: 'too long' });
        item.text = text;
      }
      await redis(['LPUSH', KEY, JSON.stringify(item)]);
      await redis(['LTRIM', KEY, 0, KEEP - 1]);
      // メールの しっぱいで チャットを とめない
      try { await notify(item); } catch (e) { console.error('chat mail failed', e && e.message); }
      return res.json({ item });
    }

    if (body.action === 'del') {
      if (!(await rateLimit(req, res, 'chat-del', 30, 600))) return;
      if (!checkToken(res, body.token)) return;
      const raw = (await redis(['LRANGE', KEY, 0, -1])) || [];
      const hit = raw.find((s) => parse(s)?.id === body.id);
      if (hit) await redis(['LREM', KEY, 1, hit]);
      return res.json({ ok: true, removed: !!hit });
    }

    return res.status(400).json({ error: 'action' });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
