const { allowOrigin, rateLimit } = require('./_guard');

module.exports = async function handler(req, res) {
  // ANRINO の サイトから だけ・1時間に 60回まで。会話は 新しい 20こ・1こ 1000字・せってい 3000字まで
  if (!allowOrigin(req, res, 'POST')) return;
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = req.body || {};
    const systemInstruction = String(body.systemInstruction || '').slice(0, 3000);
    const contents = (Array.isArray(body.contents) ? body.contents : []).slice(-20)
      .map((c) => ({ role: c && c.role, parts: [{ text: String(c?.parts?.[0]?.text || '').slice(0, 1000) }] }));
    if (!contents.length) return res.status(400).json({ error: 'no contents' });
    if (!(await rateLimit(req, res, 'chat', 60, 3600))) return;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

    // Groq (OpenAI互換) 形式に変換
    const messages = [{ role: 'system', content: systemInstruction }];
    for (const c of contents) {
      messages.push({ role: c.role === 'model' ? 'assistant' : 'user', content: c.parts[0].text });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, max_tokens: 120, temperature: 0.8 })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'Sorry, try again!';
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: 'chat failed' });
  }
};
