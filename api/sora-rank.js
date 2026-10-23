// 🏆 コロンのそらとび（/sora/）の ランキング。せかい ごとに「こんしゅう」と「ずっと」の 2つの ひょう。1人 1ぎょう（じこベスト）
//   GET  ?stage=0            : { week:[{who,score}], all:[{who,score}], weekId } … 上から 10にん
//   POST { who, stage, score }: じこベストを こえたら かきかえる。{ week:{rank,best,top}, all:{…} } を かえす
// こんしゅう は 日本の じかんで 月曜 はじまり。本番いがい（かくにん用 URL・localhost）は べつの キーに 書く
const { allowOrigin, rateLimit, redis } = require('./_guard');

const PRE = process.env.VERCEL_ENV === 'production' ? 'sora' : 'sora:test';
const WHO = ['anri', 'rino', 'mitsuki', 'kensuke', 'yusei'];
const STAGES = 2;              // ゲームの STAGES の かず（ふえたら ここも）
const MAX_SCORE = 9999999;     // 画面の スコアは 7けた
const SHOW = 10;

/** 日本の じかんで こんしゅうの 月曜日（2026-10-19 の かたち） */
function weekId(now = Date.now()) {
  const d = new Date(now + 9 * 3600 * 1000);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
const keys = (stage, w) => ({ week: `${PRE}:s${stage}:w${w}`, all: `${PRE}:s${stage}:all` });

async function top(key) {
  const raw = (await redis(['ZREVRANGE', key, 0, SHOW - 1, 'WITHSCORES'])) || [];
  const out = [];
  for (let i = 0; i < raw.length; i += 2) out.push({ who: raw[i], score: Number(raw[i + 1]) });
  return out;
}
async function mine(key, who) {
  const [rank, best] = await Promise.all([redis(['ZREVRANK', key, who]), redis(['ZSCORE', key, who])]);
  return { rank: rank == null ? null : Number(rank) + 1, best: best == null ? 0 : Number(best) };
}

module.exports = async function handler(req, res) {
  if (!allowOrigin(req, res, 'GET, POST')) return;
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const stage = Number(req.query && req.query.stage);
      if (!Number.isInteger(stage) || stage < 0 || stage >= STAGES) return res.status(400).json({ error: 'stage' });
      const w = weekId(), k = keys(stage, w);
      const [week, all] = await Promise.all([top(k.week), top(k.all)]);
      return res.json({ weekId: w, week, all });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

    if (!(await rateLimit(req, res, 'sora-rank', 60, 3600))) return;
    let body = req.body || {};
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    const who = String(body.who || ''), stage = Number(body.stage), score = Number(body.score);
    if (!WHO.includes(who)) return res.status(400).json({ error: 'who' });
    if (!Number.isInteger(stage) || stage < 0 || stage >= STAGES) return res.status(400).json({ error: 'stage' });
    if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) return res.status(400).json({ error: 'score' });

    const w = weekId(), k = keys(stage, w);
    const prev = await Promise.all([mine(k.week, who), mine(k.all, who)]);
    if (score > 0) {
      await redis(['ZADD', k.week, 'GT', score, who]);
      await redis(['EXPIRE', k.week, 60 * 60 * 24 * 21]);   // こんしゅうの ひょうは 3しゅうかんで きえる
      await redis(['ZADD', k.all, 'GT', score, who]);
    }
    const [wk, al] = await Promise.all([mine(k.week, who), mine(k.all, who)]);
    return res.json({
      weekId: w,
      week: { ...wk, newBest: score > prev[0].best },
      all: { ...al, newBest: score > prev[1].best },
    });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
