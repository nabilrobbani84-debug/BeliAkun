import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';

/**
 * GET /api/products
 * Endpoint daftar produk untuk toko akun digital 'BeliAkun'.
 *
 * Query Params (Opsional):
 *   - category: string (misal: 'ai', 'design', 'entertainment', dll)
 *   - search: string (pencarian nama produk, case-insensitive)
 *   - page: number (default: 1)
 *   - limit: number (default: 12)
 *
 * Response:
 *   - 200: { success: true, products: [...], pagination: { page, limit, total, totalPages }, categories: [...] }
 *   - 500: { success: false, message: '...' }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    let filteredProducts = [...PRODUCTS];

    // Filter berdasarkan categoryId jika parameter category diberikan
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      const categoryTerm = category.trim().toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryId.toLowerCase() === categoryTerm
      );
    }

    // Filter berdasarkan nama produk (case-insensitive) jika parameter search diberikan
    if (search && search.trim() !== '') {
      const searchTerm = search.trim().toLowerCase();
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
    }

    // Pengaturan paginasi (page & limit)
    const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
    const limit = Math.max(1, parseInt(limitParam || '12', 10) || 12);
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);

    // Ambil produk sesuai halaman dan batas yang ditentukan
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    return NextResponse.json(
      {
        success: true,
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
        categories: CATEGORIES,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan pada server saat mengambil data produk.',
      },
      { status: 500 }
    );
  }
}
