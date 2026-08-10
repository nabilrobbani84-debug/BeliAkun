import { NextResponse } from "next/server";
import { CATEGORIES } from "@/data/mockData";

/**
 * GET /api/categories
 *
 * Endpoint untuk mengambil daftar seluruh kategori produk di BeliAkun.
 *
 * Returns:
 *   - 200: { success: true, categories: CATEGORIES, total: CATEGORIES.length }
 *   - 500: { success: false, message: string }
 */
export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        categories: CATEGORIES,
        total: CATEGORIES.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server saat mengambil data kategori.",
      },
      { status: 500 }
    );
  }
}
