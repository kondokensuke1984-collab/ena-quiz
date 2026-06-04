const REPO = 'kondokensuke1984-collab/ena-quiz';
const FILE = 'yonka_data.json';
const API  = `https://api.github.com/repos/${REPO}/contents/${FILE}`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.GH_SYNC_TOKEN;
  if (!token) return res.status(500).json({ error: 'GH_SYNC_TOKEN not set' });

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  if (req.method === 'GET') {
    const r = await fetch(API, { headers });
    if (!r.ok) return res.status(r.status).json({ error: 'fetch failed' });
    const meta = await r.json();
    const data = JSON.parse(Buffer.from(meta.content, 'base64').toString('utf8'));
    return res.json({ data, sha: meta.sha });
  }

  if (req.method === 'POST') {
    const { data, sha } = req.body;
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const r = await fetch(API, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ message: 'Update yonka data', content, sha }),
    });
    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    const result = await r.json();
    return res.json({ ok: true, sha: result.content.sha });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
