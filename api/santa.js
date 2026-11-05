// 🎅 サンタさんへの おねがい（クリスマスツリーの おてがみ）。
//   POST { who, text } … text は 1〜100文字。うけとったら 保護者の 2人（api/_mail.js の PARENTS）に メールで しらせる
//   ・メールは 本番だけ（本番いがいは ログに だすだけ）。しっぱいしたら 502 を かえす（子どもが もういちど おくれる）
//   ・おねがいは Redis（リポジトリの そと）にも のこす。本番いがいは べつの リスト
//   ・あらし よけ：IP ごとに 10分で 5回・子ども1人 1日 3通まで
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { allowOrigin, rateLimit, redis } = require('./_guard');
const { RECIPIENTS } = require('./_mail');

const PROD = process.env.VERCEL_ENV === 'production';
const KEY = PROD ? 'santa:list' : 'santa:test:list';
const KEEP = 200;
const MAX_LEN = 100;
const PER_DAY = 3;
const WHO = ['anri', 'rino', 'mitsuki', 'kensuke', 'yusei'];
const NAME = { anri: 'あんり', rino: 'りの', mitsuki: 'みつき', kensuke: 'けんすけ', yusei: 'ゆうせい' };
const SITE = 'https://ena-quiz.vercel.app/';

const parse = (s) => { try { return JSON.parse(s); } catch (e) { return null; } };
const jstDay = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

async function mailParents(item) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
  const when = new Date(item.t).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  for (const addr of RECIPIENTS) {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: addr,
      subject: `🎅 サンタさんへのおねがい：${NAME[item.who]}`,
      text: `${NAME[item.who]}が サンタさんに おねがいしたよ。\n\n「${item.text}」\n\n（${when}）\n\nアプリをひらく：${SITE}`,
    });
  }
}

module.exports = async function handler(req, res) {
  if (!allowOrigin(req, res, 'POST')) return;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  try {
    const body = typeof req.body === 'string' ? parse(req.body) || {} : req.body || {};
    if (!WHO.includes(body.who)) return res.status(400).json({ error: 'who' });
    // 見えない 文字は けす・改行は 2つまで
    const text = String(body.text || '')
      .replace(/[\u0000-\u0009\u000b-\u001f\u007f​-‏‪-‮]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (!text) return res.status(400).json({ error: 'empty' });
    if ([...text].length > MAX_LEN) return res.status(400).json({ error: 'too long' });
    if (/https?:|www\./i.test(text)) return res.status(400).json({ error: 'url' });

    if (!(await rateLimit(req, res, 'santa', 5, 600))) return;
    try {
      const day = `santa:cnt:${body.who}:${jstDay()}`;
      const n = await redis(['INCR', day]);
      if (n === 1) await redis(['EXPIRE', day, 86400]);
      if (n > PER_DAY) return res.status(429).json({ error: 'too many requests' });
    } catch (e) { /* Redis が つかえないときは とおす */ }

    const item = { id: crypto.randomBytes(6).toString('hex'), t: Date.now(), who: body.who, text };
    try {
      await redis(['LPUSH', KEY, JSON.stringify(item)]);
      await redis(['LTRIM', KEY, 0, KEEP - 1]);
    } catch (e) { console.error('santa save failed', e && e.message); }

    if (!PROD) {
      console.log('santa mail (skipped, not production):', NAME[item.who], text);
      return res.json({ item, mailed: false });
    }
    try {
      await mailParents(item);
    } catch (e) {
      console.error('santa mail failed', e && e.message);
      return res.status(502).json({ error: 'mail' });
    }
    return res.json({ item, mailed: true });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
