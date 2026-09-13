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

  const { subject, htmlContent } = req.body;
  if (!subject || !htmlContent) return res.status(400).json({ error: 'Missing fields' });

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
      });
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ error: err.message });
  }
};
