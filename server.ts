import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Config status API
app.get('/api/config', (_req, res) => {
  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || '';
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET || process.env.VITE_CLOUDINARY_API_SECRET || '';

  const klumpPublicKey = (process.env.KLUMP_PUBLIC_KEY || process.env.VITE_KLUMP_PUBLIC_KEY || '').trim();
  const klumpSecretKey = (process.env.KLUMP_SECRET_KEY || process.env.VITE_KLUMP_SECRET_KEY || '').trim();

  const isCloudinarySet = Boolean(cloudinaryCloudName && (cloudinaryApiKey || cloudinaryApiSecret));
  const isKlumpSet = Boolean(klumpPublicKey && klumpSecretKey);

  res.json({
    cloudinaryConfigured: isCloudinarySet,
    cloudinaryCloudName,
    cloudinaryApiKey,
    klumpConfigured: isKlumpSet,
    klumpPublicKey,
    authorizedAdminEmail: 'smartchoiceglobalresourcesltd@gmail.com',
    storeBankAccounts: [
      {
        bankName: 'Moniepoint MFB',
        accountName: 'SMART CHOICE GLOBAL RESOURCES LTD',
        accountNumber: '5240879532'
      },
      {
        bankName: 'Sterling Bank PLC',
        accountName: 'SMART CHOICE GLOBAL RESOURCES LIMITED',
        accountNumber: '0142262389'
      }
    ],
    showrooms: [
      {
        id: 'showroom-1',
        name: 'Showroom 1 (Main NTA Road)',
        address: '71 NTA Road, Mgbuoba, Port Harcourt, Rivers State, Nigeria',
        phone: '+234 816 589 6158',
        whatsapp: '2348165896158',
        mapQuery: '71 NTA Road, Mgbuoba, Port Harcourt, Rivers State'
      },
      {
        id: 'showroom-2',
        name: 'Showroom 2 (Smart Choice Plaza)',
        address: 'Smart Choice Plaza, 37 NTA Road, Mgbuoba, Port Harcourt, Rivers State, Nigeria',
        phone: '+234 816 592 9400',
        whatsapp: '2348165929400',
        mapQuery: '37 NTA Road, Mgbuoba, Port Harcourt, Rivers State'
      }
    ]
  });
});

// Cloudinary signature generator for signed uploads
app.post('/api/cloudinary/sign', (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(200).json({
      configured: false,
      message: 'Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured in environment.'
    });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = req.body.folder || 'smartchoice/products';

  // Signature formula: folder=...&timestamp=...<secret>
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  res.json({
    configured: true,
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder
  });
});

// Cloudinary Server-side Direct Upload (Reliable Fallback)
app.post('/api/cloudinary/upload', async (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const { file, folder = 'smartchoice/products' } = req.body;

  if (!file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(200).json({
      configured: false,
      message: 'Cloudinary environment variables not set. Image kept in local buffer.',
      url: file
    });
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const formData = new URLSearchParams();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const rawText = await response.text();
    let result: any;
    try {
      result = JSON.parse(rawText);
    } catch {
      return res.status(502).json({
        error: 'Non-JSON response from Cloudinary',
        raw: rawText.slice(0, 300)
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: result.error?.message || 'Cloudinary upload failed',
        details: result
      });
    }

    return res.json({
      configured: true,
      url: result.secure_url || result.url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height
    });
  } catch (err: any) {
    console.error('Server Cloudinary upload error:', err);
    return res.status(500).json({
      error: 'Failed to upload image to Cloudinary',
      message: err.message
    });
  }
});

// Klump BNPL Initiation Endpoint (Fixes JSON crash, checks test/live environment, safe parsing)
app.post('/api/klump/checkout', async (req, res) => {
  const { amount, currency = 'NGN', redirect_url, customer, items, order_reference } = req.body;
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
      message: 'Klump Merchant Keys (KLUMP_PUBLIC_KEY and KLUMP_SECRET_KEY) are not configured in the environment variables.',
      details: {
        missing: [
          !klumpPublicKey && 'KLUMP_PUBLIC_KEY',
          !klumpSecretKey && 'KLUMP_SECRET_KEY'
        ].filter(Boolean)
      }
    });
  }

  // Determine whether to use Staging Sandbox or Production based on secret key prefix
  const isTestKey = klumpSecretKey.toLowerCase().includes('test') || klumpSecretKey.startsWith('klp_sk_test');
  const endpoint = isTestKey
    ? 'https://staging-api.useklump.com/v1/transactions/initiate'
    : 'https://api.useklump.com/v1/transactions/initiate';

  try {
    const payload = {
      amount: Math.round(amount),
      currency,
      redirect_url: redirect_url || `${req.protocol}://${req.get('host')}/track-order`,
      merchant_reference: order_reference || `KLUMP-${Date.now()}`,
      customer: {
        email: customer?.email,
        phone: customer?.phone,
        firstname: customer?.firstname || customer?.firstName || 'Customer',
        lastname: customer?.lastname || customer?.lastName || 'Shopper'
      },
      items: Array.isArray(items) && items.length > 0 ? items.map((i: any) => ({
        name: i.name || 'Product',
        unit_price: Math.round(i.unit_price || i.price || amount),
        quantity: i.quantity || 1,
        image_url: i.image_url || '',
        item_url: i.item_url || ''
      })) : [{
        name: 'Smart Choice Electronics Order',
        unit_price: Math.round(amount),
        quantity: 1
      }]
    };

    console.log(`[KLUMP INITIATE] Calling ${endpoint} for order ${payload.merchant_reference} (₦${payload.amount})`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'klump-secret-key': klumpSecretKey,
        'Authorization': `Bearer ${klumpSecretKey}`,
        'X-Klump-Public-Key': klumpPublicKey
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('[KLUMP ERROR] Received non-JSON response from Klump gateway:', responseText);
      return res.status(502).json({
        configured: true,
        error: 'Invalid response from Klump payment gateway',
        message: 'Klump gateway returned an unparseable response. Please check merchant key validity and try again.',
        raw: responseText.slice(0, 300)
      });
    }

    if (!response.ok) {
      console.warn('[KLUMP RESPONSE NOT OK]', response.status, data);
      return res.status(response.status).json({
        configured: true,
        error: data.message || 'Klump transaction initiation failed',
        details: data
      });
    }

    return res.json({
      configured: true,
      ...data
    });
  } catch (err: any) {
    console.error('Klump API checkout network error:', err);
    return res.status(500).json({
      configured: true,
      error: 'Network failure connecting to Klump payment gateway',
      message: err.message
    });
  }
});

// Klump BNPL Verification Endpoint
app.get('/api/klump/verify/:reference', async (req, res) => {
  const { reference } = req.params;
  const klumpSecretKey = (process.env.KLUMP_SECRET_KEY || '').trim();

  if (!klumpSecretKey) {
    return res.status(200).json({
      configured: false,
      message: 'Klump secret key is not configured'
    });
  }

  const isTestKey = klumpSecretKey.toLowerCase().includes('test') || klumpSecretKey.startsWith('klp_sk_test');
  const endpoint = isTestKey
    ? `https://staging-api.useklump.com/v1/transactions/verify/${encodeURIComponent(reference)}`
    : `https://api.useklump.com/v1/transactions/verify/${encodeURIComponent(reference)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'klump-secret-key': klumpSecretKey,
        'Authorization': `Bearer ${klumpSecretKey}`
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
});

// Contact message receiver
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phone, message, showroom } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  console.log(`[CONTACT INQUIRY] From: ${firstName} ${lastName} (${email}, ${phone}) for ${showroom || 'General'}: ${message}`);

  res.json({
    success: true,
    message: 'Inquiry received successfully. Our Port Harcourt showroom team will reach out shortly.'
  });
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Choice Electronics Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
