import crypto from 'crypto';

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

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.VITE_CLOUDINARY_API_SECRET;

  const { file, folder = 'smartchoice/products' } = req.body || {};

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(200).json({
      configured: false,
      message: 'Cloudinary environment variables are not configured.',
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

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
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

    return res.status(200).json({
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
      error: 'Failed to upload file to Cloudinary',
      message: err.message
    });
  }
}
