/**
 * Utility untuk menghasilkan dan memverifikasi Access Token Pesanan Guest.
 * Menggunakan Web Crypto API sehingga kompatibel dengan Cloudflare Workers (Edge).
 */

/**
 * Konversi buffer ke Base64URL
 */
function bufferToBase64url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Konversi string (biasanya token) menjadi ArrayBuffer
 */
function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * 1. Membuat Raw Access Token (32 bytes)
 * Raw token ini HANYA dikirimkan sekali ke client melalui Cookie / URL.
 * TIDAK BOLEH DISIMPAN DI DATABASE.
 */
export function generateOrderAccessToken(): string {
  // Minimal 32 bytes entropy
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return bufferToBase64url(randomBytes);
}

/**
 * 2. Membuat SHA-256 hash dari raw token
 * Hasil hash inilah yang disimpan ke database.
 */
export async function hashOrderAccessToken(rawToken: string): Promise<string> {
  const data = stringToBuffer(rawToken);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data as BufferSource);
  return bufferToBase64url(hashBuffer);
}

/**
 * 3. Memverifikasi apakah rawToken yang diberikan cocok dengan hash di database
 */
export async function verifyOrderAccessToken(rawToken: string, storedHash: string): Promise<boolean> {
  const currentHash = await hashOrderAccessToken(rawToken);
  
  // Mencegah timing attack dengan membandingkan buffer, tapi string comparison 
  // di JS untuk token cryptographic sudah cukup aman jika entropy tinggi (32 bytes random).
  // Untuk strict timing-safe comparison:
  if (currentHash.length !== storedHash.length) return false;
  
  let isEqual = true;
  for (let i = 0; i < currentHash.length; i++) {
    if (currentHash[i] !== storedHash[i]) {
      isEqual = false;
    }
  }
  
  return isEqual;
}
