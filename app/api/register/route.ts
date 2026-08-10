import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/register
 * Endpoint informasi — pendaftaran pengguna baru menggunakan method POST.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      endpoint: "/api/register",
      method: "POST",
      description: "Endpoint pendaftaran akun pengguna baru di platform BeliAkun.",
      body: {
        name: "string (minimal 2 karakter, wajib)",
        email: "string (format email valid, wajib)",
        password: "string (minimal 6 karakter, wajib)",
      },
      statusCodes: {
        201: "Pendaftaran berhasil",
        400: "Validasi data tidak sesuai atau format JSON salah",
        409: "Email sudah terdaftar",
        500: "Terjadi kesalahan pada server",
      },
    },
    { status: 200 }
  );
}

/**
 * POST /api/register
 * Endpoint untuk mendaftarkan akun baru pengguna di BeliAkun.
 *
 * Body JSON:
 *   - name: string (wajib, min 2 karakter)
 *   - email: string (wajib, format email valid)
 *   - password: string (wajib, min 6 karakter)
 *
 * Respon HTTP Status:
 *   - 201: Success - Akun berhasil dibuat
 *   - 400: Bad Request - Validasi field atau format request gagal
 *   - 409: Conflict - Email sudah terdaftar (mock: admin@beliakun.com)
 *   - 500: Internal Server Error - Sisi server mengalami kendala
 */
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Format JSON body tidak valid.",
        },
        { status: 400 }
      );
    }

    const { name, email, password } = body || {};

    // --- Validasi Field Name ---
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama minimal 2 karakter.",
        },
        { status: 400 }
      );
    }

    // --- Validasi Field Email ---
    if (!email || typeof email !== "string" || !email.trim()) {
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

    // --- Validasi Field Password ---
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Password wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password minimal 6 karakter.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // --- Mock Logika Pengecekan Email di Database ---
    // TODO: Ganti logika mock berikut dengan query DB asli (misal: Prisma / Drizzle / Mongoose)
    // Contoh: const existingUser = await db.user.findUnique({ where: { email: normalizedEmail } });
    const mockExistingEmail = "admin@beliakun.com";

    if (normalizedEmail === mockExistingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar. Silakan gunakan email lain.",
        },
        { status: 409 }
      );
    }

    // --- Mock Logika Registrasi Pengguna Baru ---
    // TODO: Hash password terlebih dahulu dengan library hashing (misal: bcryptjs / argon2)
    // Contoh: const hashedPassword = await bcrypt.hash(password, 10);
    // TODO: Simpan data pengguna ke database
    // Contoh: const user = await db.user.create({ data: { name: name.trim(), email: normalizedEmail, password: hashedPassword } });

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran akun berhasil.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registrasi Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
