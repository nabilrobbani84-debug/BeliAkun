import { Storefront } from '@/components/Storefront';
import { getActiveCategories, getActiveProducts } from '@/lib/data/catalog';
import { Product, Category, ProductPackage } from '@/types/store';
import { Category as DbCategory, ProductWithVariants } from '@/lib/supabase/types';

function mapCategory(dbCat: DbCategory): Category {
  return {
    id: dbCat.id,
    name: dbCat.name,
    slug: dbCat.slug,
    icon: dbCat.icon_key || 'Sparkles',
    count: 0, // Would need aggregate query, keep 0 for now
    bgColor: 'bg-blue-100', // Hardcoded for step 1
    badgeBg: 'bg-blue-300 text-blue-900',
    description: dbCat.description || '',
  };
}

function mapProduct(dbProd: ProductWithVariants): Product {
  const packages: ProductPackage[] = dbProd.variants.map((v) => ({
    id: v.id,
    name: v.name,
    duration: v.duration_label || 'Custom',
    price: v.price,
    originalPrice: v.compare_at_price || undefined,
    discountPercent: v.compare_at_price && v.compare_at_price > v.price
      ? Math.round(((v.compare_at_price - v.price) / v.compare_at_price) * 100)
      : 0,
    isPopular: v.package_label === 'Paling Populer',
    type: (v.account_type === 'sharing' ? 'Shared' : 'Private') as any,
    description: v.package_label || '',
  }));

  const defaultPackageId = packages.length > 0 ? packages[0].id : '';
  const inStock = dbProd.variants.some((v) => v.status === 'active');

  const tags: any[] = [];
  if (dbProd.badge === 'bestseller') tags.push('Terlaris');
  if (dbProd.badge === 'new') tags.push('Baru');
  if (dbProd.badge === 'saving') tags.push('Promo');
  if (dbProd.badge === 'limited_stock') tags.push('Stok Terbatas');

  return {
    id: dbProd.id,
    name: dbProd.name,
    slug: dbProd.slug,
    category: dbProd.category_id, // Map correctly later if needed
    categoryId: dbProd.category_id,
    description: dbProd.short_description || '',
    fullDescription: dbProd.description || '',
    logoBg: 'bg-slate-100', // Default
    logoColor: 'text-slate-900', // Default
    iconName: 'Box',
    rating: 5.0, // Default mock
    reviewCount: 0, // Default mock
    salesCount: 0, // Default mock
    tags: tags as any,
    inStock,
    packages,
    defaultPackageId,
    features: dbProd.features || [],
    instantDelivery: dbProd.delivery_method === 'instant',
    guaranteeDays: dbProd.warranty_duration || undefined,
  };
}

export default async function Page() {
  const [dbCategories, dbProducts] = await Promise.all([
    getActiveCategories(),
    getActiveProducts(),
  ]);

  const categories = dbCategories.map(mapCategory);
  const products = dbProducts.map(mapProduct);

  // If Supabase is empty or down, maybe fallback to empty state,
  // but Storefront handles empty state gracefully via ProductGrid.
  
  return <Storefront initialCategories={categories} initialProducts={products} />;
}
