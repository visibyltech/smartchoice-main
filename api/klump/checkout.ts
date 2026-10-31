export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amount, currency = 'NGN', redirect_url, customer, items, order_reference } = req.body || {};

    const klumpPublicKey = (
      process.env.KLUMP_PUBLIC_KEY ||
      process.env.VITE_KLUMP_PUBLIC_KEY ||
      ''
    ).trim();

    const klumpSecretKey = (
      process.env.KLUMP_SECRET_KEY ||
      process.env.VITE_KLUMP_SECRET_KEY ||
      ''
    ).trim();

    if (!klumpPublicKey || !klumpSecretKey) {
      return res.status(200).json({
        configured: false,
        message: 'Klump Merchant Keys are not detected in environment variables. Please ensure KLUMP_PUBLIC_KEY and KLUMP_SECRET_KEY are set in Vercel settings and redeployed.',
        details: {
          missing: [
            !klumpPublicKey && 'KLUMP_PUBLIC_KEY',
            !klumpSecretKey && 'KLUMP_SECRET_KEY'
          ].filter(Boolean)
        }
      });
    }

    // Determine sandbox vs production by checking key prefix
    const isTestKey =
      klumpSecretKey.toLowerCase().includes('test') ||
      klumpSecretKey.startsWith('klp_sk_test');

    const endpoint = 'https://api.useklump.com/v1/transactions/initiate';

    const origin = req.headers.origin || req.headers.referer || 'https://smartchoice-main.vercel.app';
    const cleanOrigin = origin.replace(/\/$/, '');

    const payload = {
      amount: Math.round(Number(amount) || 0),
      currency: currency || 'NGN',
      redirect_url: redirect_url || `${cleanOrigin}/track-order`,
      merchant_reference: order_reference || `KLUMP-${Date.now()}`,
      customer: {
        email: customer?.email || '',
        phone: customer?.phone || '',
        firstname: customer?.firstname || customer?.firstName || 'Customer',
        lastname: customer?.lastname || customer?.lastName || 'Shopper'
      },
      items: Array.isArray(items) && items.length > 0 ? items.map((i: any) => ({
        name: i.name || 'Product',
        unit_price: Math.round(Number(i.unit_price || i.price || amount)),
        quantity: Number(i.quantity) || 1,
        image_url: i.image_url || '',
        item_url: i.item_url || ''
      })) : [{
        name: 'Smart Choice Electronics Order',
        unit_price: Math.round(Number(amount) || 0),
        quantity: 1
      }]
    };

    console.log(`[KLUMP INITIATE] Calling ${endpoint} for ${payload.merchant_reference} (₦${payload.amount})`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'klump-secret-key': klumpSecretKey
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('[KLUMP PARSE ERROR] Non-JSON from Klump:', responseText);
      return res.status(502).json({
        configured: true,
        error: 'Invalid response from Klump gateway',
        message: 'Klump payment gateway returned an invalid format. Please check merchant API keys and network status.',
        raw: responseText.slice(0, 300)
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        configured: true,
        error: data.message || 'Klump transaction initiation failed',
        details: data
      });
    }

    return res.status(200).json({
      configured: true,
      ...data
    });
  } catch (err: any) {
    console.error('Klump checkout handler exception:', err);
    return res.status(500).json({
      configured: true,
      error: 'Internal server error while initiating Klump transaction',
      message: err.message || 'Unknown network error'
    });
  }
}
