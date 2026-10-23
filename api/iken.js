// 🗳️ アンリノ島の いけんばこ。書いた いけんは すぐに みんなに 見える。けすのは 保護者だけ。
//   GET            : 新しい じゅんに 100こまで
//   POST add       : { action:'add', who, text } … 1〜120文字。IP ごとに 10分で 5回まで
//   POST del       : { action:'del', id, token } … 保護者の 合言葉（ANRINO_EDIT_TOKEN）が 要る
// 本番いがい（Vercel の かくにん用 URL・localhost）は べつの リストに 書く（本番の いけんを よごさない）
const crypto = require('crypto');
const { allowOrigin, rateLimit, checkToken, redis } = require('./_guard');

const KEY = process.env.VERCEL_ENV === 'production' ? 'iken:list' : 'iken:test:list';
const KEEP = 200;            // ためておく かず
const SHOW = 100;            // 見せる かず
const MAX_LEN = 120;
const WHO = ['anri', 'rino', 'mitsuki', 'kensuke', 'yusei'];

const parse = (s) => { try { return JSON.parse(s); } catch (e) { return null; } };

module.exports = async function handler(req, res) {
  if (!allowOrigin(req, res, 'GET, POST')) return;
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const raw = (await redis(['LRANGE', KEY, 0, SHOW - 1])) || [];
      return res.json({ items: raw.map(parse).filter(Boolean) });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

    const body = typeof req.body === 'string' ? parse(req.body) || {} : req.body || {};

    if (body.action === 'add') {
      if (!(await rateLimit(req, res, 'iken', 5, 600))) return;
      // 改行は 2つまで・見えない 文字は けす
      const text = String(body.text || '')
        .replace(/[\u0000-\u0009\u000b-\u001f\u007f​-‏‪-‮]/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      if (!text) return res.status(400).json({ error: 'empty' });
      if ([...text].length > MAX_LEN) return res.status(400).json({ error: 'too long' });
      if (/https?:|www\./i.test(text)) return res.status(400).json({ error: 'url' });
      const item = {
        id: crypto.randomBytes(6).toString('hex'),
        t: Date.now(),
        who: WHO.includes(body.who) ? body.who : '',
        text,
      };
      await redis(['LPUSH', KEY, JSON.stringify(item)]);
      await redis(['LTRIM', KEY, 0, KEEP - 1]);
      return res.json({ item });
    }

    if (body.action === 'del') {
      if (!(await rateLimit(req, res, 'iken-del', 30, 600))) return;
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
