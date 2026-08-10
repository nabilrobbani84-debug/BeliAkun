import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/mockData';

/**
 * GET /api/products/[id]
 * Endpoint untuk mendapatkan detail satu produk BeliAkun berdasarkan ID atau slug.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Mendapatkan parameter id (di-await untuk Next.js 15 App Router)
    const { id } = await params;

    // Mencari produk berdasarkan ID atau slug
    const product = PRODUCTS.find((p) => p.id === id || p.slug === id);

    // Jika produk tidak ditemukan, kembalikan status 404
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Produk tidak ditemukan.',
        },
        { status: 404 }
      );
    }

    // Kembalikan data produk dengan status 200
    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    // Tangani kesalahan server dengan status 500
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan pada server.',
      },
      { status: 500 }
    );
  }
}
