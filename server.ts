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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Config status API
app.get('/api/config', (_req, res) => {
  res.json({
    cloudinaryConfigured: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    klumpConfigured: Boolean(process.env.KLUMP_PUBLIC_KEY && process.env.KLUMP_SECRET_KEY),
    klumpPublicKey: process.env.KLUMP_PUBLIC_KEY || '',
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

// Cloudinary signature generator for secure direct uploads
app.post('/api/cloudinary/sign', (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(200).json({
      configured: false,
      message: 'Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not set. The app will use direct secure image hosting / upload simulation.',
    });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = req.body.folder || 'smartchoice';
  
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

// Klump BNPL Initiation Endpoint
app.post('/api/klump/checkout', async (req, res) => {
  const { amount, currency = 'NGN', redirect_url, customer, items, order_reference } = req.body;
  const klumpPublicKey = process.env.KLUMP_PUBLIC_KEY;
  const klumpSecretKey = process.env.KLUMP_SECRET_KEY;

  if (!klumpPublicKey || !klumpSecretKey) {
    return res.status(200).json({
      configured: false,
      message: 'Klump Merchant Keys (KLUMP_PUBLIC_KEY and KLUMP_SECRET_KEY) are not set in the server environment. Please configure them in your settings.',
      details: {
        missing: [
          !klumpPublicKey && 'KLUMP_PUBLIC_KEY',
          !klumpSecretKey && 'KLUMP_SECRET_KEY'
        ].filter(Boolean)
      }
    });
  }

  try {
    const response = await fetch('https://api.useklump.com/v1/transactions/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'klump-secret-key': klumpSecretKey
      },
      body: JSON.stringify({
        amount,
        currency,
        redirect_url,
        merchant_reference: order_reference,
        customer,
        items
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err: any) {
    console.error('Klump API checkout error:', err);
    return res.status(500).json({
      error: 'Failed to initiate Klump financing session',
      message: err.message
    });
  }
});

// Klump BNPL Verification Endpoint
app.get('/api/klump/verify/:reference', async (req, res) => {
  const { reference } = req.params;
  const klumpSecretKey = process.env.KLUMP_SECRET_KEY;

  if (!klumpSecretKey) {
    return res.status(200).json({
      configured: false,
      message: 'Klump secret key is not set'
    });
  }

  try {
    const response = await fetch(`https://api.useklump.com/v1/transactions/verify/${reference}`, {
      method: 'GET',
      headers: {
        'klump-secret-key': klumpSecretKey
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err: any) {
    console.error('Klump verification error:', err);
    return res.status(500).json({
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
