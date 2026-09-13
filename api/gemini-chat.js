module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { contents, systemInstruction } = req.body;
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
    res.status(500).json({ error: err.message });
  }
};
