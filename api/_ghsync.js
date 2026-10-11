// 学判・四科・合判模試などの データファイルを GitHub リポジトリで 読み書きする API の ひながた。
//   GET : ANRINO の サイトから だけ。データと sha を かえす（ファイルが まだ なければ 空）
//   POST: さらに 保護者の 合言葉（token）が 要る。data は 200KB まで
const { allowOrigin, rateLimit, checkToken } = require('./_guard');

const REPO = 'kondokensuke1984-collab/ena-quiz';
const MAX_BYTES = 200 * 1024;

module.exports = function makeHandler(file, name) {
  const API = `https://api.github.com/repos/${REPO}/contents/${file}`;

  return async function handler(req, res) {
    if (!allowOrigin(req, res, 'GET, POST')) return;

    const ghToken = process.env.GH_SYNC_TOKEN;
    if (!ghToken) return res.status(500).json({ error: 'GH_SYNC_TOKEN not set' });
    const headers = {
      Authorization: `Bearer ${ghToken}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };

    if (req.method === 'GET') {
      const r = await fetch(API, { headers });
      // データファイルがまだ無い場合（初回）は空データを返す
      if (r.status === 404) return res.json({ data: { _tests: [] }, sha: null });
      if (!r.ok) return res.status(r.status).json({ error: 'fetch failed' });
      const meta = await r.json();
      const data = JSON.parse(Buffer.from(meta.content, 'base64').toString('utf8'));
      return res.json({ data, sha: meta.sha });
    }

    if (req.method === 'POST') {
      if (!(await rateLimit(req, res, 'ghsync', 30, 3600))) return;
      const { data, sha, token } = req.body || {};
      if (!checkToken(res, token)) return;
      if (!data || typeof data !== 'object' || Array.isArray(data)) return res.status(400).json({ error: 'bad data' });
      const json = JSON.stringify(data, null, 2);
      if (Buffer.byteLength(json) > MAX_BYTES) return res.status(413).json({ error: 'too large' });

      // sha があれば更新、無ければ新規作成（初回のファイル作成に対応）
      const body = { message: `Update ${name} data`, content: Buffer.from(json).toString('base64') };
      if (sha) body.sha = String(sha);
      const r = await fetch(API, { method: 'PUT', headers, body: JSON.stringify(body) });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      const result = await r.json();
      return res.json({ ok: true, sha: result.content.sha });
    }

    res.status(405).json({ error: 'Method not allowed' });
  };
};
