/**
 * Menghasilkan hash SHA-256 dari string signature.
 */
export async function hashSignature(rawSignature: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(rawSignature);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Konversi hashBuffer ke hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Membandingkan dua signature hash menggunakan waktu konstan (constant-time comparison)
 * untuk menghindari timing attack.
 */
export function verifySignatureHash(hashA: string, hashB: string): boolean {
  if (hashA.length !== hashB.length) return false;
  
  let result = 0;
  for (let i = 0; i < hashA.length; i++) {
    result |= hashA.charCodeAt(i) ^ hashB.charCodeAt(i);
  }
  return result === 0;
}
