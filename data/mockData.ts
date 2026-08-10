import { Category, Product, PromotionBanner, Benefit, Review, FAQItem } from '@/types/store';

export const CATEGORIES: Category[] = [
  {
    id: 'ai',
    name: 'AI Premium',
    slug: 'ai-premium',
    icon: 'Bot',
    count: 6,
    bgColor: 'bg-indigo-100',
    badgeBg: 'bg-indigo-300 text-indigo-950',
    description: 'ChatGPT Plus, Gemini Advanced, Claude Pro & AI Generatif',
  },
  {
    id: 'design',
    name: 'Design dan Edit',
    slug: 'design-dan-edit',
    icon: 'Palette',
    count: 5,
    bgColor: 'bg-pink-100',
    badgeBg: 'bg-pink-300 text-pink-950',
    description: 'Canva Pro, CapCut Pro, Adobe & Midjourney',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    slug: 'entertainment',
    icon: 'Film',
    count: 8,
    bgColor: 'bg-amber-100',
    badgeBg: 'bg-amber-300 text-amber-950',
    description: 'Netflix, Spotify, YouTube Premium & Disney+',
  },
  {
    id: 'vpn',
    name: 'VPN dan Security',
    slug: 'vpn-dan-security',
    icon: 'ShieldCheck',
    count: 4,
    bgColor: 'bg-cyan-100',
    badgeBg: 'bg-cyan-300 text-cyan-950',
    description: 'ExpressVPN, NordVPN, Surfshark & 1Password',
  },
  {
    id: 'productivity',
    name: 'Produktivitas',
    slug: 'produktivitas',
    icon: 'Briefcase',
    count: 6,
    bgColor: 'bg-emerald-100',
    badgeBg: 'bg-emerald-300 text-emerald-950',
    description: 'Microsoft 365, Notion, Zoom Pro & Google One',
  },
  {
    id: 'education',
    name: 'Edukasi',
    slug: 'edukasi',
    icon: 'GraduationCap',
    count: 4,
    bgColor: 'bg-purple-100',
    badgeBg: 'bg-purple-300 text-purple-950',
    description: 'Duolingo Super, Grammarly, Coursera & Skillshare',
  },
  {
    id: 'social',
    name: 'Media Sosial',
    slug: 'media-sosial',
    icon: 'Share2',
    count: 3,
    bgColor: 'bg-orange-100',
    badgeBg: 'bg-orange-300 text-orange-950',
    description: 'X Premium (Twitter), Telegram Premium, Discord Nitro',
  },
];

export const PROMOTION_BANNERS: PromotionBanner[] = [
  {
    id: 'banner-1',
    title: 'Akun Premium, Harga Lebih Santai',
    subtitle: 'Nikmati aplikasi favorit tanpa bikin dompet panik. Proses cepat, legal & bergaransi.',
    badgeText: '🔥 Promo Spesial Minggu Ini',
    badgeBg: 'bg-amber-300 text-slate-900',
    ctaText: 'Belanja Sekarang',
    ctaCategory: 'all',
    bgColor: 'bg-blue-600 text-white',
    accentBg: 'bg-amber-400',
    illustrationType: 'ai',
  },
  {
    id: 'banner-2',
    title: 'ChatGPT, Gemini dan Claude Tersedia',
    subtitle: 'Pilihan akun AI premium terbaik untuk belajar, bekerja, coding, dan berkarya lebih cepat.',
    badgeText: '⚡ AI Power Pack',
    badgeBg: 'bg-indigo-300 text-indigo-950',
    ctaText: 'Lihat Produk AI',
    ctaCategory: 'ai',
    bgColor: 'bg-indigo-600 text-white',
    accentBg: 'bg-emerald-400',
    illustrationType: 'general',
  },
  {
    id: 'banner-3',
    title: 'Proses Cepat dan Praktis',
    subtitle: 'Pilih produk, lakukan pembayaran via QRIS/E-Wallet, lalu langsung terima detail pesananmu.',
    badgeText: '⚡ Serba Otomatis 24/7',
    badgeBg: 'bg-emerald-300 text-emerald-950',
    ctaText: 'Cara Belanja',
    ctaCategory: 'how-it-works',
    bgColor: 'bg-emerald-600 text-white',
    accentBg: 'bg-amber-300',
    illustrationType: 'speed',
  },
];

export const BENEFITS: Benefit[] = [
  {
    id: 'benefit-1',
    title: 'Proses Cepat',
    description: 'Detail akun dikirim otomatis setelah pembayaran terkonfirmasi.',
    iconName: 'Zap',
    bgColor: 'bg-amber-100 border-amber-400',
    iconColor: 'text-amber-700',
  },
  {
    id: 'benefit-2',
    title: 'Produk Terjangkau',
    description: 'Harga hemat hingga 70% dibanding harga langganan resmi standar.',
    iconName: 'Tag',
    bgColor: 'bg-blue-100 border-blue-400',
    iconColor: 'text-blue-700',
  },
  {
    id: 'benefit-3',
    title: 'Bantuan Pelanggan',
    description: 'Tim CS ramah siap membantu kamu setiap hari dari jam 08:00 - 23:00 WIB.',
    iconName: 'Headphones',
    bgColor: 'bg-purple-100 border-purple-400',
    iconColor: 'text-purple-700',
  },
  {
    id: 'benefit-4',
    title: 'Garansi Sesuai Produk',
    description: 'Jaminan ganti baru atau garansi uang kembali jika ada kendala sistem.',
    iconName: 'ShieldCheck',
    bgColor: 'bg-emerald-100 border-emerald-400',
    iconColor: 'text-emerald-700',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus (GPT-4o & Canvas)',
    slug: 'chatgpt-plus',
    category: 'Artificial Intelligence',
    categoryId: 'ai',
    description: 'Akses GPT-4o, OpenAI o1, DALL-E 3, Voice Mode & fitur analisis dokumen.',
    fullDescription: 'Dapatkan produktivitas maksimal dengan akun ChatGPT Plus resmi. Akses model GPT-4o tercepat, kemampuan generate gambar DALL-E 3, analisis file data, serta pencarian web waktu nyata.',
    logoBg: 'bg-emerald-500',
    logoColor: 'text-white',
    iconName: 'Sparkles',
    rating: 4.9,
    reviewCount: 384,
    salesCount: 1420,
    tags: ['Terlaris', 'Promo'],
    inStock: true,
    stockCount: 24,
    instantDelivery: true,
    guaranteeDays: 30,
    defaultPackageId: 'cgpt-1m-shared',
    features: [
      'Akses GPT-4o, GPT-4 & OpenAI o1',
      'Mode Suara Tingkat Lanjut (Advanced Voice)',
      'Pembuat Gambar DALL-E 3',
      'Analisis Data & Upload Dokumen/PDF',
      'Proses aktivasi cepat & anti-lock'
    ],
    packages: [
      {
        id: 'cgpt-1m-shared',
        name: 'Shared Account 1 Bulan',
        duration: '1 Bulan',
        price: 49000,
        originalPrice: 79000,
        discountPercent: 38,
        isPopular: true,
        type: 'Shared',
        description: 'Digunakan 2-3 pengguna terpilih, hemat & stabil'
      },
      {
        id: 'cgpt-1m-private',
        name: 'Private Account 1 Bulan',
        duration: '1 Bulan',
        price: 189000,
        originalPrice: 320000,
        discountPercent: 41,
        type: 'Private',
        description: 'Akun khusus milikmu sendiri (email kamu / fresh email)'
      },
      {
        id: 'cgpt-3m-shared',
        name: 'Shared Account 3 Bulan',
        duration: '3 Bulan',
        price: 129000,
        originalPrice: 220000,
        discountPercent: 41,
        type: 'Shared',
        description: 'Hemat jangka panjang untuk kebutuhan harian'
      }
    ]
  },
  {
    id: 'gemini-advanced',
    name: 'Gemini Advanced (Google AI Ultra)',
    slug: 'gemini-advanced',
    category: 'Artificial Intelligence',
    categoryId: 'ai',
    description: 'Akses Gemini 1.5 Pro, 2TB Google One Cloud Storage, & integrasi Workspace.',
    fullDescription: 'Nikmati performa kecerdasan buatan terbaik dari Google. Gemini Advanced hadir dengan model 1.5 Pro berkemampuan konteks 1 juta token, penyimpanan Google One 2TB, serta integrasi Gmail dan Docs.',
    logoBg: 'bg-blue-600',
    logoColor: 'text-white',
    iconName: 'Bot',
    rating: 4.8,
    reviewCount: 215,
    salesCount: 890,
    tags: ['Promo', 'Baru'],
    inStock: true,
    stockCount: 18,
    instantDelivery: true,
    guaranteeDays: 30,
    defaultPackageId: 'gemini-1m-invite',
    features: [
      'Model Gemini 1.5 Pro & Gemini 2.0',
      'Konteks window 1 juta token (dokumen panjang)',
      'Bonus Google One Storage (pilihan paket)',
      'Terintegrasi dengan Gmail, Docs & Drive',
      'Garansi penuh sesuai masa aktif'
    ],
    packages: [
      {
        id: 'gemini-1m-invite',
        name: 'Invite Family 1 Bulan',
        duration: '1 Bulan',
        price: 39000,
        originalPrice: 69000,
        discountPercent: 43,
        isPopular: true,
        type: 'Invite',
        description: 'Undangan grup keluarga resmi ke email pribadi kamu'
      },
      {
        id: 'gemini-1m-private',
        name: 'Private Email Fresh 1 Bulan',
        duration: '1 Bulan',
        price: 79000,
        originalPrice: 150000,
        discountPercent: 47,
        type: 'Private',
        description: 'Dapat akun fresh Google One 2TB + Gemini Advanced'
      }
    ]
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro (Claude 3.5 Sonnet)',
    slug: 'claude-pro',
    category: 'Artificial Intelligence',
    categoryId: 'ai',
    description: 'AI terbaik untuk coding, penulisan artikel mendalam & fitur Claude Artifacts.',
    fullDescription: 'Claude Pro memberikan batas penggunaan 5x lebih tinggi untuk Claude 3.5 Sonnet & Claude 3 Opus. Sangat diminati programmer dan penulis profesional karena hasil yang natural dan presisi.',
    logoBg: 'bg-amber-600',
    logoColor: 'text-white',
    iconName: 'Cpu',
    rating: 4.9,
    reviewCount: 198,
    salesCount: 740,
    tags: ['Terlaris', 'Stok Terbatas'],
    inStock: true,
    stockCount: 8,
    instantDelivery: true,
    guaranteeDays: 30,
    defaultPackageId: 'claude-1m-shared',
    features: [
      'Akses Claude 3.5 Sonnet & Claude 3 Opus',
      'Akses fitur Claude Artifacts interaktif',
      'Batas penggunaan 5x lebih besar dari versi gratis',
      'Sangat akurat untuk coding & penulisan panjang',
      'Support kustom prompt & analisis kode'
    ],
    packages: [
      {
        id: 'claude-1m-shared',
        name: 'Shared Account 1 Bulan',
        duration: '1 Bulan',
        price: 55000,
        originalPrice: 95000,
        discountPercent: 42,
        isPopular: true,
        type: 'Shared',
        description: 'Shared 2 pemakai, sangat responsif'
      },
      {
        id: 'claude-1m-private',
        name: 'Private Account 1 Bulan',
        duration: '1 Bulan',
        price: 195000,
        originalPrice: 330000,
        discountPercent: 40,
        type: 'Private',
        description: 'Akun private siap pakai email pribadi'
      }
    ]
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro (Tim / Individual)',
    slug: 'canva-pro',
    category: 'Design & Editing',
    categoryId: 'design',
    description: 'Akses jutaan template, foto stok premium, Magic Studio AI & Brand Kit.',
    fullDescription: 'Desain apapun lebih mudah dengan Canva Pro. Buka akses ke seluruh elemen grafis premium, penghapus latar belakang sekali klik (Background Remover), resize otomatis, dan alat AI Magic Studio.',
    logoBg: 'bg-purple-600',
    logoColor: 'text-white',
    iconName: 'Palette',
    rating: 4.95,
    reviewCount: 612,
    salesCount: 2850,
    tags: ['Terlaris', 'Promo'],
    inStock: true,
    stockCount: 50,
    instantDelivery: true,
    guaranteeDays: 365,
    defaultPackageId: 'canva-1y-invite',
    features: [
      'Aktivasi langsung di email Canva pribadi kamu',
      '100+ juta foto, video & elemen grafis premium',
      'Fitur Magic Studio & AI Background Remover',
      'Fitur Magic Switch & Magic Expand',
      'Garansi penuh selama periode langganan'
    ],
    packages: [
      {
        id: 'canva-1y-invite',
        name: 'Invite Member Team 1 Tahun',
        duration: '1 Tahun',
        price: 29000,
        originalPrice: 120000,
        discountPercent: 75,
        isPopular: true,
        type: 'Invite',
        description: 'Gunakan email Canva pribadimu tanpa ganti akun'
      },
      {
        id: 'canva-lifetime',
        name: 'Member Team Lifetime Promo',
        duration: 'Lifetime',
        price: 49000,
        originalPrice: 250000,
        discountPercent: 80,
        type: 'Invite',
        description: 'Akses jangka panjang dengan garansi 1 tahun penuh'
      }
    ]
  },
  {
    id: 'capcut-pro',
    name: 'CapCut Pro (PC & Mobile)',
    slug: 'capcut-pro',
    category: 'Design & Editing',
    categoryId: 'design',
    description: 'Buka efek video VIP, AI Auto Captions, Hapus Background & ekspor 4K tanpa watermark.',
    fullDescription: 'Buat konten TikTok, Reels, dan YouTube Shorts tingkat profesional. CapCut Pro memberikan ribuan transisi VIP, AI body effect, auto-caption bahasa Indonesia, dan perbaikan suara otomatis.',
    logoBg: 'bg-slate-900',
    logoColor: 'text-white',
    iconName: 'Video',
    rating: 4.9,
    reviewCount: 430,
    salesCount: 1680,
    tags: ['Terlaris', 'Promo'],
    inStock: true,
    stockCount: 30,
    instantDelivery: true,
    guaranteeDays: 30,
    defaultPackageId: 'capcut-1m-shared',
    features: [
      'Akses semua efek & filter VIP CapCut',
      'Bisa dipakai di HP (Android/iOS) & Laptop (Windows/Mac)',
      'Ekspor video hingga kualitas 4K 60FPS',
      'AI Smart Auto Subtitle & Vocal Remover',
      'Bebas watermark CapCut Pro'
    ],
    packages: [
      {
        id: 'capcut-1m-shared',
        name: 'Shared Account 1 Bulan',
        duration: '1 Bulan',
        price: 25000,
        originalPrice: 59000,
        discountPercent: 57,
        isPopular: true,
        type: 'Shared',
        description: 'Hemat, tinggal login langsung pakai'
      },
      {
        id: 'capcut-1m-private',
        name: 'Private Email Kamu 1 Bulan',
        duration: '1 Bulan',
        price: 75000,
        originalPrice: 139000,
        discountPercent: 46,
        type: 'Private',
        description: 'Upgrade akun CapCut pribadimu sendiri'
      },
      {
        id: 'capcut-1y-shared',
        name: 'Shared Account 1 Tahun',
        duration: '1 Tahun',
        price: 119000,
        originalPrice: 290000,
        discountPercent: 58,
        type: 'Shared',
        description: 'Garansi aktif 1 tahun penuh'
      }
    ]
  },
  {
    id: 'vpn-premium',
    name: 'VPN Premium (ExpressVPN / NordVPN)',
    slug: 'vpn-premium',
    category: 'VPN & Security',
    categoryId: 'vpn',
    description: 'Buka blokir situs, koneksi super cepat, proteksi enkripsi & server global.',
    fullDescription: 'Jelajahi internet secara aman, bebas hambatan, dan privat. Pilih antara ExpressVPN, NordVPN, atau Surfshark dengan server berkecepatan tinggi di 90+ negara.',
    logoBg: 'bg-cyan-600',
    logoColor: 'text-white',
    iconName: 'ShieldCheck',
    rating: 4.85,
    reviewCount: 290,
    salesCount: 1120,
    tags: ['Promo', 'Hemat'],
    inStock: true,
    stockCount: 15,
    instantDelivery: true,
    guaranteeDays: 30,
    defaultPackageId: 'nord-1m-shared',
    features: [
      'Server super cepat di 90+ negara',
      'Cocok untuk streaming, gaming & browsing aman',
      'Fitur Kill Switch & Enkripsi AES-256',
      'Bisa untuk HP, Laptop & Smart TV',
      'Garansi penggantian akun jika ada masalah'
    ],
    packages: [
      {
        id: 'nord-1m-shared',
        name: 'NordVPN Shared 1 Bulan',
        duration: '1 Bulan',
        price: 19000,
        originalPrice: 45000,
        discountPercent: 57,
        isPopular: true,
        type: 'Shared',
        description: 'Support 1 device login'
      },
      {
        id: 'express-1m-shared',
        name: 'ExpressVPN Shared 1 Bulan',
        duration: '1 Bulan',
        price: 29000,
        originalPrice: 65000,
        discountPercent: 55,
        type: 'Shared',
        description: 'Koneksi paling kencang untuk streaming'
      },
      {
        id: 'surfshark-1y-shared',
        name: 'Surfshark VPN 1 Tahun',
        duration: '1 Tahun',
        price: 89000,
        originalPrice: 250000,
        discountPercent: 64,
        type: 'Shared',
        description: 'Super hemat garansi 12 bulan'
      }
    ]
  },
  {
    id: 'spotify-premium',
    name: 'Spotify Premium Individual / Family',
    slug: 'spotify-premium',
    category: 'Entertainment',
    categoryId: 'entertainment',
    description: 'Dengar musik tanpa iklan, download lagu offline, kualitas suara sangat tinggi.',
    fullDescription: 'Dengarkan jutaan lagu dan podcast tanpa gangguan iklan. Fitur skip lagu tak terbatas, download lagu untuk didengar secara offline, dan suara jernih 320kbps.',
    logoBg: 'bg-green-600',
    logoColor: 'text-white',
    iconName: 'Music',
    rating: 4.9,
    reviewCount: 520,
    salesCount: 2310,
    tags: ['Terlaris', 'Promo'],
    inStock: true,
    stockCount: 40,
    instantDelivery: true,
    guaranteeDays: 30,
    defaultPackageId: 'spoti-1m-plan',
    features: [
      'Bebas iklan selamanya saat aktif',
      'Putar lagu sesukamu tanpa batasan skip',
      'Download musik untuk diputar offline',
      'Bisa upgrade akun Spotify pribadimu',
      'Garansi penuh sesuai durasi'
    ],
    packages: [
      {
        id: 'spoti-1m-plan',
        name: 'Invite Family Plan 1 Bulan',
        duration: '1 Bulan',
        price: 18000,
        originalPrice: 55000,
        discountPercent: 67,
        isPopular: true,
        type: 'Invite',
        description: 'Gunakan akun Spotify lamamu'
      },
      {
        id: 'spoti-3m-plan',
        name: 'Invite Family Plan 3 Bulan',
        duration: '3 Bulan',
        price: 45000,
        originalPrice: 165000,
        discountPercent: 72,
        type: 'Invite',
        description: 'Hemat 3 bulan tanpa ganti playlist'
      },
      {
        id: 'spoti-1m-indiv',
        name: 'Individual Private Fresh 1 Bulan',
        duration: '1 Bulan',
        price: 29000,
        originalPrice: 60000,
        discountPercent: 51,
        type: 'Private',
        description: 'Akun Spotify private milikmu sendiri'
      }
    ]
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium & Music',
    slug: 'youtube-premium',
    category: 'Entertainment',
    categoryId: 'entertainment',
    description: 'Tonton video tanpa iklan, latar belakang tetap berputar (Background Play) & YouTube Music.',
    fullDescription: 'Nikmati YouTube tanpa potongan iklan sama sekali. Video bisa tetap berjalan saat layar HP mati atau saat membuka aplikasi lain. Sudah termasuk aplikasi YouTube Music Premium gratis.',
    logoBg: 'bg-red-600',
    logoColor: 'text-white',
    iconName: 'Youtube',
    rating: 4.95,
    reviewCount: 680,
    salesCount: 3100,
    tags: ['Terlaris', 'Promo'],
    inStock: true,
    stockCount: 60,
    instantDelivery: true,
    guaranteeDays: 30,
    defaultPackageId: 'yt-1m-family',
    features: [
      'Bebas iklan di YouTube HP, PC & Smart TV',
      'Putar video di latar belakang (Background Play)',
      'Gratis akses ke aplikasi YouTube Music Premium',
      'Download video & lagu untuk ditonton offline',
      'Pakai email Gmail milikmu sendiri'
    ],
    packages: [
      {
        id: 'yt-1m-family',
        name: 'Invite Family Plan 1 Bulan',
        duration: '1 Bulan',
        price: 12000,
        originalPrice: 35000,
        discountPercent: 65,
        isPopular: true,
        type: 'Invite',
        description: 'Super hemat via undangan grup'
      },
      {
        id: 'yt-3m-family',
        name: 'Invite Family Plan 3 Bulan',
        duration: '3 Bulan',
        price: 32000,
        originalPrice: 105000,
        discountPercent: 69,
        type: 'Invite',
        description: 'Favorit pelanggan, bebas pusing 3 bulan'
      },
      {
        id: 'yt-1y-indiv',
        name: 'Individual Account 1 Tahun',
        duration: '1 Tahun',
        price: 149000,
        originalPrice: 420000,
        discountPercent: 64,
        type: 'Full Access',
        description: 'Langganan panjang garansi 12 bulan'
      }
    ]
  },
  {
    id: 'netflix-premium',
    name: 'Netflix Premium 4K Ultra HD',
    slug: 'netflix-premium',
    category: 'Entertainment',
    categoryId: 'entertainment',
    description: 'Streaming film & serial kualitas 4K Ultra HD + HDR, profil dengan PIN pribadi.',
    fullDescription: 'Nonton serial hits, drakor, dan film bioskop terbaru di Netflix dengan kualitas tertinggi 4K Ultra HD. Profil dilindungi PIN rahasia sehingga riwayat tontonanmu aman dan tidak bercampur.',
    logoBg: 'bg-red-700',
    logoColor: 'text-white',
    iconName: 'Tv',
    rating: 4.88,
    reviewCount: 490,
    salesCount: 1950,
    tags: ['Terlaris', 'Promo'],
    inStock: true,
    stockCount: 12,
    instantDelivery: true,
    guaranteeDays: 30,
    defaultPackageId: 'netf-1m-shared-pin',
    features: [
      'Kualitas Gambar 4K Ultra HD + HDR',
      '1 Profil khusus dengan PIN pengunci 4 digit',
      'Bisa dipakai di HP, Tablet, Laptop & Smart TV',
      'Garansi anti-household / anti-layar terkunci',
      'Proses reset garansi cepat jika ada kendala'
    ],
    packages: [
      {
        id: 'netf-1m-shared-pin',
        name: '1 Profil Shared 1 Bulan (1 Device)',
        duration: '1 Bulan',
        price: 35000,
        originalPrice: 75000,
        discountPercent: 53,
        isPopular: true,
        type: 'Shared',
        description: 'Dapat 1 profil dengan PIN pribadi'
      },
      {
        id: 'netf-1m-private-account',
        name: 'Private Account Full 1 Bulan (4 Screen)',
        duration: '1 Bulan',
        price: 155000,
        originalPrice: 186000,
        discountPercent: 16,
        type: 'Private',
        description: 'Satu akun utuh milikmu (4 layar bersamaan)'
      }
    ]
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365 + 1TB OneDrive',
    slug: 'microsoft-365',
    category: 'Productivity',
    categoryId: 'productivity',
    description: 'Word, Excel, PowerPoint, Outlook & 1TB Cloud Storage OneDrive resmi.',
    fullDescription: 'Tingkatkan efisiensi kerja dan kuliah dengan Microsoft 365 resmi. Dapatkan aplikasi Word, Excel, PowerPoint terbaru untuk 5 perangkat (PC/Mac/HP) plus penyimpanan awan OneDrive 1TB.',
    logoBg: 'bg-orange-600',
    logoColor: 'text-white',
    iconName: 'FileText',
    rating: 4.9,
    reviewCount: 310,
    salesCount: 1240,
    tags: ['Promo', 'Hemat'],
    inStock: true,
    stockCount: 22,
    instantDelivery: true,
    guaranteeDays: 365,
    defaultPackageId: 'ms365-1y-family',
    features: [
      'Aplikasi Word, Excel, PowerPoint & Outlook versi penuh',
      'Penyimpanan Awan OneDrive 1TB aman & cepat',
      'Dapat diinstal di hingga 5 perangkat sekaligus',
      'Aktivasi pada akun Microsoft pribadi kamu',
      'Garansi resmi 1 tahun penuh'
    ],
    packages: [
      {
        id: 'ms365-1y-family',
        name: 'Invite Family 1 Tahun (Email Pribadi)',
        duration: '1 Tahun',
        price: 89000,
        originalPrice: 280000,
        discountPercent: 68,
        isPopular: true,
        type: 'Invite',
        description: 'Pakai email Microsoft milikmu sendiri'
      },
      {
        id: 'ms365-1y-account',
        name: 'Account Custom Name 1 Tahun + 1TB',
        duration: '1 Tahun',
        price: 59000,
        originalPrice: 190000,
        discountPercent: 68,
        type: 'Full Access',
        description: 'Dapat akun baru dengan nama milikmu'
      }
    ]
  },
  {
    id: 'notion-plus-ai',
    name: 'Notion Plus + Notion AI',
    slug: 'notion-plus-ai',
    category: 'Productivity',
    categoryId: 'productivity',
    description: 'Ruang kerja serba bisa tanpa batas file upload, database advance & Notion AI.',
    fullDescription: 'Kelola catatan, tugas project, database, dan wiki tim dalam satu tempat. Kombinasi Notion Plus dan Notion AI membantu membuat rangkuman, draf dokumen, dan riset secara instan.',
    logoBg: 'bg-slate-800',
    logoColor: 'text-white',
    iconName: 'CheckSquare',
    rating: 4.85,
    reviewCount: 140,
    salesCount: 560,
    tags: ['Baru'],
    inStock: true,
    stockCount: 14,
    instantDelivery: true,
    guaranteeDays: 30,
    defaultPackageId: 'notion-1m-invite',
    features: [
      'Fitur Notion Plus tanpa batasan file upload',
      'Fitur Notion AI Asisten Penulis & Rangkuman',
      'Riwayat versi halaman hingga 30 hari',
      'Sangat cocok untuk mahasiswa, freelancer & startup',
      'Proses upgrade instan'
    ],
    packages: [
      {
        id: 'notion-1m-invite',
        name: 'Upgrade Workspace 1 Bulan',
        duration: '1 Bulan',
        price: 39000,
        originalPrice: 85000,
        discountPercent: 54,
        isPopular: true,
        type: 'Invite',
        description: 'Di-upgrade di workspace Notion kamu'
      },
      {
        id: 'notion-1y-invite',
        name: 'Upgrade Workspace 1 Tahun',
        duration: '1 Tahun',
        price: 189000,
        originalPrice: 450000,
        discountPercent: 58,
        type: 'Invite',
        description: 'Hemat 1 tahun penuh produktif'
      }
    ]
  },
  {
    id: 'midjourney-pro',
    name: 'Midjourney AI v6',
    slug: 'midjourney-pro',
    category: 'Design & Editing',
    categoryId: 'design',
    description: 'Generator gambar AI paling realistis & artistik via server Discord khusus.',
    fullDescription: 'Hasilkan karya seni digital, desain produk, ilustrasi buku, dan foto hiper-realistis dengan Midjourney v6. Akses via bot Discord privat yang mudah digunakan.',
    logoBg: 'bg-violet-700',
    logoColor: 'text-white',
    iconName: 'Image',
    rating: 4.8,
    reviewCount: 120,
    salesCount: 430,
    tags: ['Promo', 'Stok Terbatas'],
    inStock: true,
    stockCount: 5,
    instantDelivery: true,
    guaranteeDays: 30,
    defaultPackageId: 'midj-1m-shared',
    features: [
      'Akses model Midjourney v6 & Niji 6',
      'Fitur Fast Hours untuk hasil gambar cepat',
      'Room Discord privat aman tanpa spamming',
      'Bisa atur rasio aspect ratio (--ar 16:9, 9:16, dll)',
      'Panduan awal penggunaan lengkap'
    ],
    packages: [
      {
        id: 'midj-1m-shared',
        name: 'Shared Server Discord 1 Bulan',
        duration: '1 Bulan',
        price: 69000,
        originalPrice: 150000,
        discountPercent: 54,
        isPopular: true,
        type: 'Shared',
        description: 'Gunakan bot di server terdedikasi'
      },
      {
        id: 'midj-1m-basic-private',
        name: 'Basic Plan Private 1 Bulan',
        duration: '1 Bulan',
        price: 175000,
        originalPrice: 280000,
        discountPercent: 37,
        type: 'Private',
        description: 'Akun Discord private bawaan'
      }
    ]
  },
  {
    id: 'duolingo-super',
    name: 'Duolingo Super (Nyawa Tak Terbatas)',
    slug: 'duolingo-super',
    category: 'Education',
    categoryId: 'education',
    description: 'Belajar bahasa tanpa batasan nyawa, bebas iklan & latihan percakapan khusus.',
    fullDescription: 'Masteri bahasa asing seperti Inggris, Jepang, Mandarin, atau Prancis dengan Duolingo Super. Bebas iklan, nyawa tidak bisa habis, dan ada tinjauan kesalahan otomatis.',
    logoBg: 'bg-lime-500',
    logoColor: 'text-slate-900',
    iconName: 'GraduationCap',
    rating: 4.9,
    reviewCount: 175,
    salesCount: 820,
    tags: ['Promo', 'Hemat'],
    inStock: true,
    stockCount: 20,
    instantDelivery: true,
    guaranteeDays: 365,
    defaultPackageId: 'duo-1y-family',
    features: [
      'Nyawa (Hearts) Tak Terbatas',
      'Bebas iklan pengganggu saat belajar',
      'Latihan pengucapan & tata bahasa khusus',
      'Upgrade email Duolingo milikmu sendiri',
      'Garansi aktif 1 tahun penuh'
    ],
    packages: [
      {
        id: 'duo-1y-family',
        name: 'Invite Family Plan 1 Tahun',
        duration: '1 Tahun',
        price: 39000,
        originalPrice: 149000,
        discountPercent: 73,
        isPopular: true,
        type: 'Invite',
        description: 'Gunakan akun Duolingo pribadimu'
      }
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Rian Prasetyo',
    avatarBg: 'bg-blue-200 text-blue-900',
    avatarEmoji: '😎',
    rating: 5,
    productPurchased: 'ChatGPT Plus (1 Bulan)',
    comment: 'Prosesnya beneran nggak sampai 3 menit! Detail akun langsung masuk. GPT-4o lancar jaya buat bantu skripsi.',
    date: 'Kemarin',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Anisa Rahma',
    avatarBg: 'bg-pink-200 text-pink-900',
    avatarEmoji: '👩‍🎨',
    rating: 5,
    productPurchased: 'Canva Pro (1 Tahun)',
    comment: 'Admin ramah banget diajarin pas sempat bingung gabung team. Sekarang tugas desain IG feed makin gampang!',
    date: '2 hari lalu',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Dion Wibowo',
    avatarBg: 'bg-amber-200 text-amber-900',
    avatarEmoji: '🎬',
    rating: 5,
    productPurchased: 'CapCut Pro (1 Bulan)',
    comment: 'CapCut Pro mantap no watermark, auto caption bahasa Indo lancar. Recommended buat yang mau ngonten TikTok!',
    date: '3 hari lalu',
    verified: true,
  },
  {
    id: 'rev-4',
    name: 'Bima Setya',
    avatarBg: 'bg-emerald-200 text-emerald-900',
    avatarEmoji: '🚀',
    rating: 5,
    productPurchased: 'Claude Pro (1 Bulan)',
    comment: 'Claude 3.5 Sonnet jos banget buat nulis script Python. Harga di Beliakun jauuh lebih hemat daripada $20.',
    date: '4 hari lalu',
    verified: true,
  },
  {
    id: 'rev-5',
    name: 'Siti Nurhaliza',
    avatarBg: 'bg-purple-200 text-purple-900',
    avatarEmoji: '🍿',
    rating: 5,
    productPurchased: 'YouTube Premium (3 Bulan)',
    comment: 'Nonton YouTube di TV kamar bebas iklan, anak-anak seneng. Nanti pas habis pasti re-order lagi di sini.',
    date: '5 hari lalu',
    verified: true,
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara membeli produk di Beliakun.com?',
    answer: 'Cukup pilih produk yang kamu inginkan, tentukan durasi atau tipe paket, masukkan ke keranjang, lalu lakukan pembayaran via QRIS atau E-Wallet. Detail pesanan akan diproses otomatis & dikirimkan ke kontak kamu.',
    category: 'pembelian'
  },
  {
    id: 'faq-2',
    question: 'Kapan pesanan saya diproses?',
    answer: 'Mayoritas produk diproses secara instan (1–5 menit) setelah sistem mengonfirmasi pembayaranmu. Untuk paket tipe Invite/Upgrade email pribadi, tim kami akan memproses dalam waktu maksimal 15 menit pada jam operasional.',
    category: 'proses'
  },
  {
    id: 'faq-3',
    question: 'Apakah setiap produk memiliki garansi?',
    answer: 'Ya! Setiap produk yang kamu beli di Beliakun.com dilengkapi garansi resmi sesuai masa aktif paket. Jika terjadi kendala seperti akses terputus, kami siap memberikan perbaikan atau akun ganti baru.',
    category: 'garansi'
  },
  {
    id: 'faq-4',
    question: 'Bagaimana jika pesanan saya mengalami kendala?',
    answer: 'Kamu bisa langsung mengklik tombol bantuan WhatsApp atau live chat di website ini. Tim Customer Service Beliakun siap membantu menyelesaikan kendalamu dengan cepat dan ramah.',
    category: 'bantuan'
  },
  {
    id: 'faq-5',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: 'Kami mendukung seluruh metode pembayaran populer di Indonesia: QRIS (GoPay, OVO, Dana, ShopeePay, LinkAja, Mobile Banking), Transfer Bank (BCA, Mandiri, BRI, BNI), serta minimarket Alfamart / Indomaret.',
    category: 'pembayaran'
  },
  {
    id: 'faq-6',
    question: 'Apakah Beliakun.com berafiliasi resmi dengan brand yang dijual?',
    answer: 'Beliakun.com merupakan penyedia dan reseller independen produk/layanan digital pihak ketiga. Seluruh nama, logo, dan merek dagang adalah hak milik dari masing-masing pemilik merek.',
    category: 'disclaimer'
  }
];
