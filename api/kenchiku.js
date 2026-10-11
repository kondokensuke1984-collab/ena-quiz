// 一級建築士アプリ（architect-exam）で正解した問題を預かる場所。
//   POST: 一級建築士アプリが「年度.ビットマップ」を預ける（合言葉 KENCHIKU_TOKEN が要る。いままでの預かりぶんと OR で合わせる）
//   GET : ANRINO（ホーム画面のアプリ）が開いたときに、預かりぶんを受け取る
// ホーム画面のアプリ同士は localStorage を共有できないので、サーバー（Upstash Redis）を経由する。
// 形式は ?kenchiku= / ?kenchiku1= と同じ（medalFromKenchiku がそのまま読める）。二重取りは ANRINO 側の台帳（kc:…）で防ぐ。
const KEY = 'kenchiku:v1';
const ORIGIN_OK = ['https://architect-exam-nine.vercel.app'];
const { redis } = require('./_guard');

// "R08.AQID,R07.AAE" → { R08: Buffer, R07: Buffer }
function parse(txt) {
  const out = {};
  String(txt || '').split(',').slice(0, 20).forEach((part) => {
    const m = /^([HR]\d{2})\.([A-Za-z0-9_-]{1,400})$/.exec(part);
    if (m) out[m[1]] = Buffer.from(m[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  });
  return out;
}
function stringify(obj) {
  return Object.keys(obj).sort().map((y) => y + '.' + obj[y].toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')).join(',');
}
function merge(a, b) {
  const out = { ...a };
  Object.keys(b).forEach((y) => {
    const x = out[y] || Buffer.alloc(0);
    const n = Buffer.alloc(Math.max(x.length, b[y].length));
    for (let i = 0; i < n.length; i++) n[i] = (x[i] || 0) | (b[y][i] || 0);
    out[y] = n;
  });
  return out;
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin;
  if (ORIGIN_OK.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const saved = JSON.parse((await redis(['GET', KEY])) || '{}');

    if (req.method === 'GET') {
      return res.status(200).json({ kenchiku: saved.k4 || '', kenchiku1: saved.k1 || '', day: saved.day || '' });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (!process.env.KENCHIKU_TOKEN || body.token !== process.env.KENCHIKU_TOKEN) return res.status(401).json({ error: 'unauthorized' });

    const next = {
      k4: stringify(merge(parse(saved.k4), parse(body.kenchiku))),
      k1: stringify(merge(parse(saved.k1), parse(body.kenchiku1))),
      // 今日あずけた日（ANRINO が「きょうの 島の入口」をひらく目印）。形式は ANRINO の今日の日付と同じ（例 2026-10-8）
      day: /^\d{4}-\d{1,2}-\d{1,2}$/.test(String(body.day || '')) ? body.day : (saved.day || ''),
    };
    await redis(['SET', KEY, JSON.stringify(next)]);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
