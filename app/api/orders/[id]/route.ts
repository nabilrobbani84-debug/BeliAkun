import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/orders/[id]
 * Endpoint pencarian status pesanan untuk toko akun digital 'BeliAkun'.
 *
 * Params:
 *   - id: string (harus diawali dengan 'BLK-')
 *
 * Response:
 *   - 200: { success: true, order: { orderId, status, message } }
 *   - 404: { success: false, message: 'Pesanan tidak ditemukan.' }
 *   - 500: { success: false, message: 'Terjadi kesalahan pada server.' }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validasi format Order ID (harus diawali dengan 'BLK-')
    if (!id || !id.startsWith("BLK-")) {
      return NextResponse.json(
        {
          success: false,
          message: "Pesanan tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // Mock data pesanan (karena belum menggunakan database nyata)
    return NextResponse.json(
      {
        success: true,
        order: {
          orderId: id,
          status: "completed",
          message:
            "Pesanan telah selesai. Detail akun telah dikirim via WhatsApp.",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
