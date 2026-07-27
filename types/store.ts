export type PackageType = 'Private' | 'Shared' | 'Invite' | 'Full Access';

export interface ProductPackage {
  id: string;
  name: string;
  duration: string; // e.g. "1 Bulan", "3 Bulan", "1 Tahun"
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  isPopular?: boolean;
  type: PackageType;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId: string;
  description: string;
  fullDescription?: string;
  logoBg: string; // e.g. "bg-emerald-500", "bg-purple-600"
  logoColor: string;
  iconName: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  tags: ('Terlaris' | 'Promo' | 'Baru' | 'Stok Terbatas' | 'Hemat')[];
  inStock: boolean;
  stockCount?: number;
  packages: ProductPackage[];
  defaultPackageId: string;
  features: string[];
  instantDelivery?: boolean;
  guaranteeDays?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  bgColor: string; // Tailwind bg class like "bg-blue-100"
  badgeBg: string;
  description: string;
}

export interface PromotionBanner {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeBg: string;
  ctaText: string;
  ctaCategory?: string;
  bgColor: string;
  accentBg: string;
  illustrationType: 'ai' | 'speed' | 'discount' | 'general';
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
  bgColor: string;
  iconColor: string;
}

export interface Review {
  id: string;
  name: string;
  avatarBg: string;
  avatarEmoji: string;
  rating: number;
  productPurchased: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + package.id)
  product: Product;
  selectedPackage: ProductPackage;
  quantity: number;
}
