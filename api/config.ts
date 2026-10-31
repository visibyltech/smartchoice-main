export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || '';
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET || process.env.VITE_CLOUDINARY_API_SECRET || '';

  const klumpPublicKey = (process.env.KLUMP_PUBLIC_KEY || process.env.VITE_KLUMP_PUBLIC_KEY || '').trim();
  const klumpSecretKey = (process.env.KLUMP_SECRET_KEY || process.env.VITE_KLUMP_SECRET_KEY || '').trim();

  res.status(200).json({
    cloudinaryConfigured: Boolean(cloudinaryCloudName && (cloudinaryApiKey || cloudinaryApiSecret)),
    cloudinaryCloudName,
    cloudinaryApiKey,
    klumpConfigured: Boolean(klumpPublicKey && klumpSecretKey),
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
}
