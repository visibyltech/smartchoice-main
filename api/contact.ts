export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { firstName, lastName, email, phone, message, showroom } = req.body || {};
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  console.log(`[CONTACT INQUIRY] From: ${firstName} ${lastName} (${email}, ${phone}) for ${showroom || 'General'}: ${message}`);

  res.status(200).json({
    success: true,
    message: 'Inquiry received successfully. Our Port Harcourt showroom team will reach out shortly.'
  });
}
