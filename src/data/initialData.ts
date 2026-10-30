import { Category, Product, Slide, Showroom, StoreBankAccount } from '../types';

export const SHOWROOMS: Showroom[] = [
  {
    id: 'showroom-1',
    name: 'Showroom 1 (71 NTA Road)',
    address: '71 NTA Road, Mgbuoba, Port Harcourt, Rivers State, Nigeria',
    phone: '+234 816 589 6158',
    whatsapp: '2348165896158',
    mapQuery: '71 NTA Road, Mgbuoba, Port Harcourt, Rivers State, Nigeria'
  },
  {
    id: 'showroom-2',
    name: 'Showroom 2 (Smart Choice Plaza)',
    address: 'Smart Choice Plaza, 37 NTA Road, Mgbuoba, Port Harcourt, Rivers State, Nigeria',
    phone: '+234 816 592 9400',
    whatsapp: '2348165929400',
    mapQuery: '37 NTA Road, Mgbuoba, Port Harcourt, Rivers State, Nigeria'
  }
];

export const STORE_BANK_ACCOUNTS: StoreBankAccount[] = [
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
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Televisions', slug: 'televisions', displayOnHome: true, sortOrder: 1, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-2', name: 'Refrigerators', slug: 'refrigerators', displayOnHome: true, sortOrder: 2, image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-3', name: 'Freezers', slug: 'freezers', displayOnHome: true, sortOrder: 3, image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-4', name: 'Air Conditioners', slug: 'air-conditioners', displayOnHome: true, sortOrder: 4, image: 'https://images.unsplash.com/photo-1614633833026-0e1b6951910a?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-5', name: 'Washing Machines', slug: 'washing-machines', displayOnHome: true, sortOrder: 5, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-6', name: 'Cookers and Gas Appliances', slug: 'cookers-gas-appliances', displayOnHome: true, sortOrder: 6, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-7', name: 'Microwave Ovens', slug: 'microwave-ovens', displayOnHome: true, sortOrder: 7, image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-8', name: 'Inverters and Power Solutions', slug: 'inverters-power-solutions', displayOnHome: true, sortOrder: 8, image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-9', name: 'Generators', slug: 'generators', displayOnHome: true, sortOrder: 9, image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-10', name: 'Solar Generators', slug: 'solar-generators', displayOnHome: true, sortOrder: 10, image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-11', name: 'Inverter Batteries', slug: 'inverter-batteries', displayOnHome: true, sortOrder: 11, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-12', name: 'Perkins Generators', slug: 'perkins-generators', displayOnHome: true, sortOrder: 12, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-13', name: 'Modern Furniture', slug: 'modern-furniture', displayOnHome: true, sortOrder: 13, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-14', name: 'General Merchandise', slug: 'general-merchandise', displayOnHome: true, sortOrder: 14, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80' },
];

export const INITIAL_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    title: 'Smart Power & Home Electronics in Port Harcourt',
    subtitle: 'Buy original inverter systems, solar generators, and smart home appliances with guaranteed warranty.',
    badge: 'NEW ARRIVALS 2026',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1600&q=80',
    link: '/shop',
    buttonText: 'Shop New Arrivals',
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'slide-2',
    title: 'Flexible Save to Buy Installment Plans',
    subtitle: 'Lock down your dream refrigerator, television, or power generator at 3%, 5%, or 7% fixed interest.',
    badge: 'SAVE TO BUY EASY SAVINGS',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1600&q=80',
    link: '/save-to-buy',
    buttonText: 'Start a Plan Today',
    sortOrder: 2,
    isActive: true
  },
  {
    id: 'slide-3',
    title: 'Heavy Duty Generators & Solar Inverters',
    subtitle: 'Experience 24/7 uninterrupted power with Firman, Perkins, and Felicity Solar lithium solutions.',
    badge: 'UNINTERRUPTED POWER',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
    link: '/category/inverters-power-solutions',
    buttonText: 'Explore Power Solutions',
    sortOrder: 3,
    isActive: true
  },
  {
    id: 'slide-4',
    title: 'Visit Our Two Port Harcourt Showrooms',
    subtitle: 'Showroom 1 at 71 NTA Road & Showroom 2 at Smart Choice Plaza (37 NTA Road), Mgbuoba.',
    badge: 'WALK IN TODAY',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    link: '/contact',
    buttonText: 'Get Showroom Directions',
    sortOrder: 4,
    isActive: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Televisions
  {
    id: 'prod-tv-1',
    name: 'Hisense 65-Inch 4K UHD Smart Google TV (A6K Series)',
    slug: 'hisense-65-inch-4k-uhd-smart-google-tv',
    categoryId: 'cat-1',
    categoryName: 'Televisions',
    brand: 'Hisense',
    model: '65A6K',
    price: 685000,
    originalPrice: 740000,
    stock: 12,
    inStock: true,
    featured: true,
    isBestSeller: true,
    isDeal: true,
    discountPercent: 7,
    description: 'Experience breathtaking cinema visuals with the Hisense 65A6K 4K UHD Smart TV. Packed with Dolby Vision HDR, DTS Virtual:X sound, Sports Mode, and Google TV voice control with remote.',
    specifications: {
      'Screen Size': '65 Inches',
      'Display Resolution': '3840 x 2160 (4K UHD)',
      'HDR Support': 'Dolby Vision, HDR10, HLG',
      'Operating System': 'Google TV',
      'Audio Output': '20W DTS Virtual:X',
      'Connectivity': '3x HDMI 2.1, 2x USB, Wi-Fi 5, Bluetooth 5.0, LAN'
    },
    warranty: '2 Years Manufacturer Warranty',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-tv-2',
    name: 'LG 55-Inch OLED Evo C3 4K Smart TV',
    slug: 'lg-55-inch-oled-c3-4k-smart-tv',
    categoryId: 'cat-1',
    categoryName: 'Televisions',
    brand: 'LG',
    model: 'OLED55C36LC',
    price: 1350000,
    originalPrice: 1450000,
    stock: 6,
    inStock: true,
    featured: true,
    isNewArrival: true,
    description: 'The pinnacle of OLED technology. The LG OLED C3 features self-lit pixels, the α9 AI Processor Gen6, Brightness Booster, Dolby Atmos audio, and webOS 23 with ThinQ AI.',
    specifications: {
      'Screen Size': '55 Inches',
      'Panel Type': 'OLED Evo (Infinite Contrast)',
      'Processor': 'α9 AI Processor Gen6 4K',
      'Refresh Rate': '120Hz Native',
      'Sound': '40W 2.2 Channel Dolby Atmos',
      'Gaming': 'G-Sync, FreeSync, 4x HDMI 2.1 48Gbps'
    },
    warranty: '2 Years Official LG Warranty',
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 2. Refrigerators
  {
    id: 'prod-ref-1',
    name: 'Haier Thermocool 250L Double Door Frost Free Refrigerator',
    slug: 'haier-thermocool-250l-double-door-refrigerator',
    categoryId: 'cat-2',
    categoryName: 'Refrigerators',
    brand: 'Haier Thermocool',
    model: 'HT-HRF250',
    price: 520000,
    originalPrice: 560000,
    stock: 9,
    inStock: true,
    featured: true,
    isBestSeller: true,
    description: 'Equipped with energy-saving tropical compressor built for Nigerian power voltage fluctuations. Features multi-air flow cooling, large vegetable crisper, and LED interior light.',
    specifications: {
      'Capacity': '250 Litres',
      'Cooling Type': 'Frost Free',
      'Voltage Protection': 'Low Voltage Operation (135V - 260V)',
      'Refrigerant': 'R600a Eco-Friendly Gas',
      'Colour': 'Inox Silver Finish'
    },
    warranty: '3 Years Warranty on Compressor, 1 Year Full Unit',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1536353284924-9240ccfc426e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-ref-2',
    name: 'Samsung 450L Side-by-Side Digital Inverter Refrigerator',
    slug: 'samsung-450l-side-by-side-refrigerator',
    categoryId: 'cat-2',
    categoryName: 'Refrigerators',
    brand: 'Samsung',
    model: 'RS50N3513S8',
    price: 1420000,
    originalPrice: 1550000,
    stock: 4,
    inStock: true,
    featured: true,
    description: 'All-around cooling system ensures even temperature throughout all shelves. Digital Inverter Technology automatically adjusts compressor speed across 7 cooling levels.',
    specifications: {
      'Capacity': '450 Litres',
      'Compressor': 'Digital Inverter (10 Year Warranty)',
      'Doors': 'Side-by-Side Dual Doors',
      'Deodorizer': 'Built-in Activated Carbon Filter',
      'Finish': 'Refined Inox Stainless Steel'
    },
    warranty: '10 Years on Digital Inverter Compressor',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1536353284924-9240ccfc426e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 3. Freezers
  {
    id: 'prod-frz-1',
    name: 'Haier Thermocool 319L Chest Freezer (Fast Freeze & 100hr Retention)',
    slug: 'haier-thermocool-319l-chest-freezer',
    categoryId: 'cat-3',
    categoryName: 'Freezers',
    brand: 'Haier Thermocool',
    model: 'HT-CF319S',
    price: 495000,
    originalPrice: 535000,
    stock: 14,
    inStock: true,
    featured: true,
    isBestSeller: true,
    description: 'Up to 100 hours of cooling retention after power outage. Super freeze function rapidly drops temperature to preserve fresh meats, fish, vegetables, and drinks.',
    specifications: {
      'Gross Capacity': '319 Litres',
      'Cooling Retention': '100 Hours after power cut',
      'Interior': 'Embossed Aluminum interior with storage basket',
      'Lock & Key': 'High security external lock with handle',
      'Low Voltage Run': 'Operates smoothly from 160V'
    },
    warranty: '3 Years Warranty on Compressor',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1536353284924-9240ccfc426e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 4. Air Conditioners
  {
    id: 'prod-ac-1',
    name: 'Panasonic 1.5HP Inverter Split Air Conditioner (Copper Condenser)',
    slug: 'panasonic-1-5hp-inverter-split-air-conditioner',
    categoryId: 'cat-4',
    categoryName: 'Air Conditioners',
    brand: 'Panasonic',
    model: 'CS-PU12XKD',
    price: 485000,
    originalPrice: 520000,
    stock: 10,
    inStock: true,
    featured: true,
    isDeal: true,
    discountPercent: 7,
    description: 'Save up to 50% electricity with Panasonic Econavi Inverter Technology. 100% Pure copper condenser, aerowings twin flaps for fast cooling, and anti-bacterial air purifier.',
    specifications: {
      'Horsepower': '1.5 HP',
      'Cooling Capacity': '12,000 BTU/h',
      'Condenser': '100% Pure Copper with Blue Fin anti-rust coat',
      'Refrigerant': 'R32 Eco Gas',
      'Voltage Range': '145V - 264V'
    },
    warranty: '2 Years Manufacturer Warranty',
    images: [
      'https://images.unsplash.com/photo-1614633833026-0e1b6951910a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-ac-2',
    name: 'Hisense 2HP Inverter Copper Split Air Conditioner',
    slug: 'hisense-2hp-inverter-copper-split-ac',
    categoryId: 'cat-4',
    categoryName: 'Air Conditioners',
    brand: 'Hisense',
    model: 'AS-18TR4RYR',
    price: 580000,
    originalPrice: 620000,
    stock: 8,
    inStock: true,
    featured: false,
    description: 'High capacity 2.0HP cooling for large living rooms, master bedrooms, and office suites. Whisper-quiet operation with I-Feel intelligent remote temperature sensor.',
    specifications: {
      'Horsepower': '2.0 HP',
      'Cooling Capacity': '18,000 BTU/h',
      'Condenser': 'Heavy Duty Copper Coils',
      'Energy Rating': 'Inverter Energy Saver A++',
      'Features': 'Turbo Cooling, Self-Cleaning, Sleep Mode'
    },
    warranty: '1 Year Full Unit + 5 Years Compressor Warranty',
    images: [
      'https://images.unsplash.com/photo-1614633833026-0e1b6951910a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 5. Washing Machines
  {
    id: 'prod-wm-1',
    name: 'LG 9KG Front Load AI Direct Drive Washer & Steam Dryer',
    slug: 'lg-9kg-front-load-ai-direct-drive-washer',
    categoryId: 'cat-5',
    categoryName: 'Washing Machines',
    brand: 'LG',
    model: 'F4V5VYP0W',
    price: 840000,
    originalPrice: 910000,
    stock: 5,
    inStock: true,
    featured: true,
    isNewArrival: true,
    description: 'Intelligent fabric protection with AI DD: detects weight and fabric softness to optimize wash motion. Steam allergy care removes 99.9% of dust mites and allergens.',
    specifications: {
      'Washing Capacity': '9.0 KG',
      'Spin Speed': '1400 RPM',
      'Motor': 'Inverter Direct Drive (10 Year Warranty)',
      'Steam Technology': 'Steam+ Allergy Care',
      'Smart Feature': 'ThinQ WiFi Smartphone Control'
    },
    warranty: '10 Years Warranty on Direct Drive Motor',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 6. Cookers and Gas Appliances
  {
    id: 'prod-ck-1',
    name: 'Maxi 4-Burner Gas Cooker with Oven & Grill (50x50 Stainless Steel)',
    slug: 'maxi-4-burner-gas-cooker-with-oven-grill',
    categoryId: 'cat-6',
    categoryName: 'Cookers and Gas Appliances',
    brand: 'Maxi',
    model: 'MAXI-50504B-SS',
    price: 235000,
    originalPrice: 260000,
    stock: 15,
    inStock: true,
    featured: true,
    isBestSeller: true,
    description: 'Durable, rust-proof stainless steel 4-gas burner cooker with glass lid, top and bottom burner gas oven, turnspit grill, push button automatic ignition, and oven lamp.',
    specifications: {
      'Dimensions': '50cm x 50cm x 85cm',
      'Burners': '4 High-Efficiency Gas Burners',
      'Oven': 'Gas Oven & Electric Grill with Thermostat',
      'Ignition': 'Electric Auto-Ignition for burners and oven',
      'Body': 'Heavy Grade Brushed Stainless Steel'
    },
    warranty: '1 Year Official Warranty',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 7. Microwave Ovens
  {
    id: 'prod-mw-1',
    name: 'Panasonic 27L Inverter Convection Microwave Oven with Grill',
    slug: 'panasonic-27l-inverter-convection-microwave-oven',
    categoryId: 'cat-7',
    categoryName: 'Microwave Ovens',
    brand: 'Panasonic',
    model: 'NN-CT56JB',
    price: 245000,
    originalPrice: 275000,
    stock: 11,
    inStock: true,
    featured: false,
    description: 'Slimline design microwave featuring genuine Inverter technology for precision continuous heating. Combined microwave, convection oven baking, and quartz grill functions.',
    specifications: {
      'Capacity': '27 Litres',
      'Microwave Power': '1000W Inverter',
      'Grill Power': '1300W Quartz',
      'Convection Temperature': '100°C - 220°C',
      'Auto Menus': '29 Auto Cook Programs'
    },
    warranty: '1 Year Warranty',
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 8. Inverters and Power Solutions
  {
    id: 'prod-inv-1',
    name: 'Luminous 3.5kVA / 48V Pure Sine Wave Inverter (Cruze Series)',
    slug: 'luminous-3-5kva-48v-pure-sine-wave-inverter',
    categoryId: 'cat-8',
    categoryName: 'Inverters and Power Solutions',
    brand: 'Luminous',
    model: 'Cruze 3.5kVA/48V',
    price: 610000,
    originalPrice: 660000,
    stock: 7,
    inStock: true,
    featured: true,
    isBestSeller: true,
    description: 'Heavy duty pure sine wave power inverter capable of running entire apartments or offices including 1.5HP inverter air conditioner, refrigerators, TVs, lighting, and computing gear.',
    specifications: {
      'Capacity': '3.5 kVA / 48V DC',
      'Output Waveform': 'Pure Sine Wave (Safe for sensitive electronics)',
      'Battery Voltage': '48V (Requires 4x 12V or 1x 48V Lithium)',
      'Display': 'Intuitive Digital LCD screen for load and backup time',
      'Protections': 'Overload, Short Circuit, Reverse Polarity, Deep Discharge'
    },
    warranty: '2 Years Manufacturer Warranty',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-inv-2',
    name: 'Felicity Solar 5kVA 48V Hybrid Solar Inverter with 80A MPPT',
    slug: 'felicity-solar-5kva-48v-hybrid-inverter',
    categoryId: 'cat-8',
    categoryName: 'Inverters and Power Solutions',
    brand: 'Felicity Solar',
    model: 'FL-IVPS5048',
    price: 890000,
    originalPrice: 960000,
    stock: 5,
    inStock: true,
    featured: true,
    description: 'Advanced hybrid solar inverter with built-in 80A MPPT solar charge controller. Seamlessly blends grid power, solar panel power, and battery backup with zero transfer delay.',
    specifications: {
      'Rated Power': '5000 Watts (5kVA)',
      'DC Voltage': '48V',
      'MPPT Solar Input': 'Up to 500V DC Voc, 5000W PV Array',
      'Parallel Support': 'Scalable up to 9 units in parallel',
      'Communication': 'RS485, CAN, Wi-Fi Remote Monitoring'
    },
    warranty: '2 Years Full Replacement Warranty',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 9. Generators
  {
    id: 'prod-gen-1',
    name: 'Firman 7.5kVA Key-Start Heavy Duty Gasoline Generator (ECO10990ES)',
    slug: 'firman-7-5kva-key-start-gasoline-generator',
    categoryId: 'cat-9',
    categoryName: 'Generators',
    brand: 'Firman',
    model: 'ECO10990ES',
    price: 780000,
    originalPrice: 840000,
    stock: 8,
    inStock: true,
    featured: true,
    isDeal: true,
    discountPercent: 7,
    description: 'Original 100% copper coiled Firman 7.5kVA generator with electric key starter, heavy duty tubular wheelbarrow kit, large 28L fuel tank, and AVR voltage stabilizer.',
    specifications: {
      'Starting Capacity': '7.5 kVA (6000W)',
      'Running Capacity': '7.0 kVA (5500W)',
      'Engine': '4-Stroke OHV Single Cylinder Air-Cooled Engine',
      'Alternator': '100% Pure Copper Wire Coil',
      'Starting Method': 'Electric Key Start & Recoil Starter',
      'Fuel Tank': '28.5 Litres (up to 11 hours continuous runtime)'
    },
    warranty: '1 Year Manufacturer Warranty',
    images: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 10. Solar Generators
  {
    id: 'prod-sol-1',
    name: 'EcoFlow Delta 2 Max 2400W / 2048Wh Expandable Solar Generator',
    slug: 'ecoflow-delta-2-max-2400w-solar-generator',
    categoryId: 'cat-10',
    categoryName: 'Solar Generators',
    brand: 'EcoFlow',
    model: 'DELTA 2 Max',
    price: 1850000,
    originalPrice: 1980000,
    stock: 4,
    inStock: true,
    featured: true,
    isNewArrival: true,
    description: 'Ultra-fast recharging solar power station with long-lasting LiFePO4 battery chemistry (3000+ cycles). Can power 99% of home appliances, from air conditioners to freezers and TVs.',
    specifications: {
      'Battery Capacity': '2048 Wh (Expandable up to 6144 Wh with Extra Batteries)',
      'AC Output': '2400W Pure Sine Wave (Surge 4800W)',
      'Battery Chemistry': 'LFP (LiFePO4) Battery with 10-year lifespan',
      'Solar Input': 'Up to 1000W Dual Solar MPPT Charging',
      'Recharge Time': '0 to 80% in 43 minutes via AC wall socket'
    },
    warranty: '5 Years Official Manufacturer Warranty',
    images: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 11. Inverter Batteries
  {
    id: 'prod-bat-1',
    name: 'Felicity Solar 5.12kWh 48V 100Ah Lithium LiFePO4 Wall-Mount Battery',
    slug: 'felicity-solar-5-12kwh-48v-lithium-lifepo4-battery',
    categoryId: 'cat-11',
    categoryName: 'Inverter Batteries',
    brand: 'Felicity Solar',
    model: 'LPBA48100-OL',
    price: 1750000,
    originalPrice: 1890000,
    stock: 7,
    inStock: true,
    featured: true,
    isBestSeller: true,
    description: 'Premium A-grade prismatic LiFePO4 lithium cells with smart internal BMS. Up to 6000 cycles at 80% DOD, LCD status monitor, breaker protection, and wall-mounting bracket included.',
    specifications: {
      'Usable Energy': '5.12 kWh',
      'Nominal Voltage': '51.2 V',
      'Nominal Capacity': '100 Ah',
      'Cycle Life': '> 6000 Cycles @ 80% DOD',
      'BMS Protection': 'Over-charge, Over-discharge, High/Low Temp, Short Circuit'
    },
    warranty: '5 Years Manufacturer Warranty',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-bat-2',
    name: 'Luminous 12V 220Ah Tubular Deep Cycle Inverter Battery',
    slug: 'luminous-12v-220ah-tubular-deep-cycle-battery',
    categoryId: 'cat-11',
    categoryName: 'Inverter Batteries',
    brand: 'Luminous',
    model: 'ILTT26060 (220Ah)',
    price: 360000,
    originalPrice: 395000,
    stock: 16,
    inStock: true,
    featured: false,
    description: 'Rugged tall tubular battery engineered for long and frequent power outages in Nigeria. Thick spine technology with high acid reservoir for extended maintenance cycles.',
    specifications: {
      'Voltage': '12V',
      'Capacity': '220 Ah at C20 rating',
      'Plate Technology': 'Hadi High Pressure Cast Tall Tubular Spine',
      'Electrolyte Level': '6 Floating Level Indicator Plugs',
      'Weight': '65 KG filled'
    },
    warranty: '18 Months Replacement Warranty',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 12. Perkins Generators
  {
    id: 'prod-perk-1',
    name: 'Perkins 20kVA Soundproof Diesel Generator with Automatic Transfer Switch',
    slug: 'perkins-20kva-soundproof-diesel-generator',
    categoryId: 'cat-12',
    categoryName: 'Perkins Generators',
    brand: 'Perkins',
    model: '404D-22G / 20kVA',
    price: 9800000,
    originalPrice: 10500000,
    stock: 2,
    inStock: true,
    featured: true,
    description: 'Industrial grade 3-phase soundproof canopy diesel generator powered by an authentic UK Perkins engine. Ideal for luxury residential homes, hospitals, hotels, and corporate offices.',
    specifications: {
      'Prime Output': '20 kVA / 16 kW',
      'Standby Output': '22 kVA / 17.6 kW',
      'Engine Model': 'Perkins 404D-22G (Water-cooled 4-Cylinder)',
      'Alternator': 'Stamford / Leroy-Somer Brushless with AVR',
      'Canopy': 'Super Silent Soundproof Acoustic Enclosure (< 68 dBA @ 7m)',
      'Controller': 'Deep Sea Electronics (DSE) Auto-Mains Failure'
    },
    warranty: '1 Year or 1000 Operating Hours Commercial Warranty',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 13. Modern Furniture
  {
    id: 'prod-fur-1',
    name: 'Executive Ergonomic High-Back Reclining Leather Office Chair',
    slug: 'executive-ergonomic-high-back-office-chair',
    categoryId: 'cat-13',
    categoryName: 'Modern Furniture',
    brand: 'Smart Choice Living',
    model: 'SCL-EXEC-01',
    price: 185000,
    originalPrice: 210000,
    stock: 12,
    inStock: true,
    featured: false,
    description: 'Luxurious bonded leather executive chair with dynamic lumbar support, padded waterfall armrests, 135-degree recline lock, extendable footrest, and heavy duty steel base.',
    specifications: {
      'Material': 'High-Density Foam & Premium Breathable PU Leather',
      'Mechanism': 'Multi-function Tilt & Height Lock Pneumatic Gas Lift',
      'Weight Capacity': 'Up to 150 KG',
      'Base': 'Class 4 Heavy Duty Chrome Star Base with Mute Castors'
    },
    warranty: '1 Year Warranty on Mechanism & Gas Lift',
    images: [
      'https://images.unsplash.com/photo-1580481077195-c328a37ea71a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-fur-2',
    name: 'Modern Floating TV Console & Wall Media Unit with LED Illumination',
    slug: 'modern-floating-tv-console-wall-media-unit',
    categoryId: 'cat-13',
    categoryName: 'Modern Furniture',
    brand: 'Smart Choice Living',
    model: 'SCL-TV-FLOAT',
    price: 295000,
    originalPrice: 330000,
    stock: 6,
    inStock: true,
    featured: true,
    description: 'Sleek wall-mounted media console designed to accommodate up to 85-inch flat screen TVs. Features hidden cable management channels, soft-close cabinet drawers, and RGB backlight.',
    specifications: {
      'Dimensions': '200cm Length x 35cm Depth x 30cm Height',
      'Material': 'E1 Moisture-Resistant High Gloss MDF with Melamine Finish',
      'Weight Support': 'Holds up to 80 KG',
      'Accessories': 'Pre-assembled wall mounting anchors and remote LED strip'
    },
    warranty: '2 Years Structural Warranty',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1580481077195-c328a37ea71a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // 14. General Merchandise
  {
    id: 'prod-genm-1',
    name: 'Royal 18-Inch Rechargeable Solar Mist Fan with Remote & LED Light',
    slug: 'royal-18-inch-rechargeable-solar-mist-fan',
    categoryId: 'cat-14',
    categoryName: 'General Merchandise',
    brand: 'Royal',
    model: 'RRF-18MIST',
    price: 115000,
    originalPrice: 130000,
    stock: 20,
    inStock: true,
    featured: false,
    isDeal: true,
    discountPercent: 11,
    description: 'Keep your room cool even during Port Harcourt afternoon heat waves without electricity. 18-inch fan blades with ultrasonic water mist cooler, USB phone charger, and solar panel input.',
    specifications: {
      'Size': '18 Inches Diameter',
      'Battery': '12V 4.5Ah Rechargeable Lead Acid Battery (Up to 10 hours runtime)',
      'Water Tank': '2.5 Litres Ultrasonic Mist',
      'Extra Features': 'Solar panel charge port, USB phone charger, Remote control, Night lamp'
    },
    warranty: '1 Year Warranty',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=80'
    ]
  }
];
