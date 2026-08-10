import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/forgot-password
 * Informational endpoint — forgot password requires POST method.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      endpoint: "/api/forgot-password",
      method: "POST",
      message:
        "Gunakan method POST dengan body JSON { email } untuk meminta instruksi reset kata sandi.",
    },
    { status: 200 }
  );
}

/**
 * POST /api/forgot-password
 *
 * Body JSON:
 *   - email: string (required)
 *
 * Returns:
 *   - 200: { success: true, message: 'Jika email terdaftar, instruksi reset kata sandi telah dikirim.' }
 *   - 400: { success: false, message: '...' } (missing or invalid email)
 *   - 500: { success: false, message: '...' } (server error)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // --- Validation ---
    if (!email || typeof email !== "string" || email.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Email wajib diisi.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Format email tidak valid.",
        },
        { status: 400 }
      );
    }

    // --- Mock Logic & Security Note ---
    // TODO: Implementasi logika pengiriman email reset password secara nyata.
    // Contoh langkah-langkah:
    // 1. Periksa apakah email terdaftar di database.
    // 2. Jika terdaftar, buat token reset password aman yang memiliki batas waktu kedaluwarsa.
    // 3. Simpan token reset password di database / Redis.
    // 4. Kirim email berisi tautan reset kata sandi ke alamat email pengguna.
    // Catatan: Selalu kembalikan respons sukses generik terlepas dari apakah email ditemukan atau tidak
    // untuk mencegah pembocoran informasi pengguna (email enumeration protection).

    return NextResponse.json(
      {
        success: true,
        message: "Jika email terdaftar, instruksi reset kata sandi telah dikirim.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
