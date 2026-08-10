import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/login
 * Informational endpoint — login requires POST method.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      endpoint: "/api/login",
      method: "POST",
      message: "Gunakan method POST dengan body JSON { email, password } untuk login.",
    },
    { status: 200 }
  );
}

/**
 * POST /api/login
 *
 * Body JSON:
 *   - email: string (required)
 *   - password: string (required)
 *
 * Returns:
 *   - 200: { success: true, user: { name, email }, token }
 *   - 400: { success: false, message: "..." } (missing fields)
 *   - 401: { success: false, message: "..." } (invalid credentials)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // --- Validation ---
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format email tidak valid.",
        },
        { status: 400 }
      );
    }

    // Password minimum length
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password minimal 6 karakter.",
        },
        { status: 400 }
      );
    }

    // --- Authentication ---
    // TODO: Replace this mock logic with real database lookup
    // Example: query user from database, verify hashed password, etc.
    const mockUser = {
      email: "admin@beliakun.com",
      password: "password123",
      name: "Admin Beliakun",
    };

    if (email !== mockUser.email || password !== mockUser.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    // --- Success Response ---
    // TODO: Generate a real JWT token or session token
    const token = `mock-token-${Date.now()}`;

    return NextResponse.json(
      {
        success: true,
        message: "Login berhasil.",
        user: {
          name: mockUser.name,
          email: mockUser.email,
        },
        token,
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
