const nodemailer = require('nodemailer');

const RECIPIENTS = [
  'kondokensuke1984@gmail.com',
  'm.moon.u.94@gmail.com',
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { subject, htmlContent, images } = req.body;
  if (!subject || !htmlContent) return res.status(400).json({ error: 'Missing fields' });

  // 本文に うめこむ 画像（もしの しまの 手書きなど）。Gmail は data: の画像を出さないので CID の添付にする
  //   images: [{ cid:'hand-1', dataUrl:'data:image/jpeg;base64,...' }]（20まいまで・1まい 300KB まで。かん字テストは14まい）
  const attachments = [];
  if (Array.isArray(images)) {
    for (const im of images.slice(0, 20)) {
      const m = im && typeof im.dataUrl === 'string' && im.dataUrl.match(/^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/);
      if (!m || !/^[A-Za-z0-9_-]{1,40}$/.test(String(im.cid || '')) || m[2].length > 400000) continue;
      attachments.push({ filename: im.cid + (m[1] === 'png' ? '.png' : '.jpg'), content: m[2], encoding: 'base64', cid: im.cid });
    }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    for (const to of RECIPIENTS) {
      await transporter.sendMail({
        from: `"ANRINOアプリ" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
        attachments,
      });
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ error: err.message });
  }
};
