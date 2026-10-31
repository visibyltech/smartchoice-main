export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const reference = req.query?.reference || req.query?.ref;
  if (!reference) {
    return res.status(400).json({ error: 'Missing transaction reference' });
  }

  const klumpSecretKey = (
    process.env.KLUMP_SECRET_KEY ||
    process.env.VITE_KLUMP_SECRET_KEY ||
    ''
  ).trim();

  if (!klumpSecretKey) {
    return res.status(200).json({
      configured: false,
      message: 'Klump secret key is not configured in environment variables'
    });
  }

  const isTestKey =
    klumpSecretKey.toLowerCase().includes('test') ||
    klumpSecretKey.startsWith('klp_sk_test');

  const endpoint = `https://api.useklump.com/v1/transactions/${encodeURIComponent(reference)}/verify`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'klump-secret-key': klumpSecretKey
      }
    });

    const responseText = await response.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      return res.status(502).json({
        configured: true,
        error: 'Invalid response format from Klump verification service',
        raw: responseText.slice(0, 300)
      });
    }

    return res.status(response.status).json(data);
  } catch (err: any) {
    console.error('Klump verification error:', err);
    return res.status(500).json({
      configured: true,
      error: 'Failed to verify Klump transaction',
      message: err.message
    });
  }
}
