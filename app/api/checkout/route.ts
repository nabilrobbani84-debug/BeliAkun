import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/mockData';

// Daftar metode pembayaran yang valid
const VALID_PAYMENT_METHODS = ['qris', 'gopay', 'bca'] as const;
type PaymentMethod = (typeof VALID_PAYMENT_METHODS)[number];

/**
 * GET /api/checkout
 * Endpoint informasi tentang cara penggunaan API checkout.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      endpoint: '/api/checkout',
      method: 'POST',
      message: 'Gunakan method POST dengan body JSON untuk membuat pesanan checkout baru di BeliAkun.',
      schema: {
        productId: 'string (wajib) - ID produk',
        packageId: 'string (wajib) - ID paket produk',
        customerName: 'string (wajib) - Nama pembeli, minimal 2 karakter',
        whatsappNumber: 'string (wajib) - Nomor WhatsApp, minimal 9 digit angka',
        email: 'string (opsional) - Alamat email pembeli',
        paymentMethod: "'qris' | 'gopay' | 'bca' (wajib) - Metode pembayaran",
      },
    },
    { status: 200 }
  );
}

/**
 * POST /api/checkout
 * Membuat pesanan checkout baru untuk produk akun digital BeliAkun.
 *
 * Request Body:
 * {
 *   productId: string,
 *   packageId: string,
 *   customerName: string,
 *   whatsappNumber: string,
 *   email?: string,
 *   paymentMethod: 'qris' | 'gopay' | 'bca'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Format data JSON tidak valid.',
        },
        { status: 400 }
      );
    }

    const { productId, packageId, customerName, whatsappNumber, email, paymentMethod } = body;

    // --- Validasi Field Wajib ---
    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'ID produk (productId) wajib diisi.',
        },
        { status: 400 }
      );
    }

    if (!packageId || typeof packageId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'ID paket (packageId) wajib diisi.',
        },
        { status: 400 }
      );
    }

    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nama pelanggan (customerName) wajib diisi minimal 2 karakter.',
        },
        { status: 400 }
      );
    }

    if (!whatsappNumber || typeof whatsappNumber !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Nomor WhatsApp (whatsappNumber) wajib diisi.',
        },
        { status: 400 }
      );
    }

    // Validasi nomor WhatsApp (minimal 9 digit angka)
    const digitsOnly = whatsappNumber.replace(/\D/g, '');
    if (digitsOnly.length < 9) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nomor WhatsApp harus terdiri dari minimal 9 digit angka.',
        },
        { status: 400 }
      );
    }

    if (!paymentMethod || typeof paymentMethod !== 'string' || !VALID_PAYMENT_METHODS.includes(paymentMethod as PaymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Metode pembayaran tidak valid. Pilih antara qris, gopay, atau bca.',
        },
        { status: 400 }
      );
    }

    // --- Verifikasi Produk & Paket ---
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Produk tidak ditemukan.',
        },
        { status: 404 }
      );
    }

    const selectedPackage = product.packages.find((pkg) => pkg.id === packageId);
    if (!selectedPackage) {
      return NextResponse.json(
        {
          success: false,
          message: 'Paket produk tidak ditemukan.',
        },
        { status: 404 }
      );
    }

    // --- Pembuatan Mock Order ID ---
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
    const orderId = `BLK-${randomDigits}`;

    const newOrder = {
      orderId,
      product: {
        name: product.name,
        package: selectedPackage.name,
      },
      customer: {
        name: customerName.trim(),
        whatsapp: whatsappNumber.trim(),
        email: typeof email === 'string' && email.trim() ? email.trim() : null,
      },
      payment: {
        method: paymentMethod as PaymentMethod,
        amount: selectedPackage.price,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saat memproses checkout:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
