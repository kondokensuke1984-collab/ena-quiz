// API の まもり（名前が _ で はじまるので Vercel は API として 公開しない）。
//   ・allowOrigin：ANRINO の サイトから だけ うけつける（ほかの サイトの ページからの よびだしは 403）
//   ・rateLimit  ：IP ごとの 回数制限（Upstash Redis。Redis が おちていたら 止めずに とおす）
//   ・checkToken ：保護者の 合言葉（ANRINO_EDIT_TOKEN）。書きかえる API だけで つかう
const crypto = require('crypto');

const ORIGIN_OK = [
  'https://ena-quiz.vercel.app',
  /^https:\/\/ena-quiz-[a-z0-9-]+\.vercel\.app$/,   // Vercel の かくにん用 URL
  /^http:\/\/localhost(:\d+)?$/,
];
const originOk = (o) => ORIGIN_OK.some((p) => (typeof p === 'string' ? p === o : p.test(o)));

async function redis(cmd) {
  const r = await fetch(process.env.KV_REST_API_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error('redis ' + r.status);
  return (await r.json()).result;
}

/** CORS の ヘッダーを つけ、ほかの サイトからなら 403 を かえして false。OPTIONS も ここで おわらせる */
function allowOrigin(req, res, methods) {
  const origin = req.headers.origin;
  const site = req.headers['sec-fetch-site'];
  if (origin && originOk(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', methods + ', OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if ((origin && !originOk(origin)) || (site && site !== 'same-origin' && site !== 'none' && !(origin && originOk(origin)))) {
    res.status(403).json({ error: 'forbidden' });
    return false;
  }
  if (req.method === 'OPTIONS') { res.status(200).end(); return false; }
  return true;
}

/** name ごとに sec 秒で n 回まで。こえたら 429 を かえして false */
async function rateLimit(req, res, name, n, sec) {
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const key = `rl:${name}:${ip}`;
  try {
    const count = await redis(['INCR', key]);
    if (count === 1) await redis(['EXPIRE', key, sec]);
    if (count > n) {
      res.status(429).json({ error: 'too many requests' });
      return false;
    }
  } catch (e) { /* Redis が つかえないときは とおす */ }
  return true;
}

/** 保護者の 合言葉が あっているか。ちがえば 401（未設定なら 503）を かえして false */
function checkToken(res, token) {
  const want = process.env.ANRINO_EDIT_TOKEN;
  if (!want) { res.status(503).json({ error: 'ANRINO_EDIT_TOKEN not set' }); return false; }
  const a = Buffer.from(String(token || '')), b = Buffer.from(want);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) { res.status(401).json({ error: 'unauthorized' }); return false; }
  return true;
}

module.exports = { allowOrigin, rateLimit, checkToken, redis };
