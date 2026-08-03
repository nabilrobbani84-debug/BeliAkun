import { env } from '@/lib/env';

/**
 * Konfigurasi Crypto
 */
const ENCRYPTION_VERSION = 1;
const ALGORITHM_NAME = 'AES-GCM';
const HASH_ALGORITHM = 'SHA-256';
const HKDF_INFO_ENCRYPTION = new TextEncoder().encode('beliakun-inventory-encryption-v1');
const HKDF_INFO_FINGERPRINT = new TextEncoder().encode('beliakun-inventory-fingerprint-v1');

export interface EncryptedPayload {
  version: number;
  algorithm: string;
  iv: string; // base64url
  ciphertext: string; // base64url
}

/**
 * Utility untuk konversi dari/ke Base64URL.
 * Mendukung browser & Edge Runtime (Cloudflare Workers).
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

function base64urlToBuffer(base64url: string): ArrayBuffer {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Mendapatkan master key material dari environment.
 */
async function getMasterKeyMaterial(): Promise<CryptoKey> {
  const masterKeyBase64 = env.INVENTORY_MASTER_KEY_V1;
  if (!masterKeyBase64) {
    throw new Error('Missing INVENTORY_MASTER_KEY_V1 environment variable.');
  }
  const masterKeyBuffer = base64urlToBuffer(masterKeyBase64); // Asumsi base64 standard atau url
  return await crypto.subtle.importKey(
    'raw',
    masterKeyBuffer,
    { name: 'HKDF' },
    false,
    ['deriveKey', 'deriveBits']
  );
}

/**
 * Derive AES-GCM Key untuk enkripsi payload.
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const masterKey = await getMasterKeyMaterial();
  return await crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: HASH_ALGORITHM,
      salt: new Uint8Array(),
      info: HKDF_INFO_ENCRYPTION,
    },
    masterKey,
    { name: ALGORITHM_NAME, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Derive HMAC Key untuk fingerprint.
 */
async function getFingerprintKey(): Promise<CryptoKey> {
  const masterKey = await getMasterKeyMaterial();
  return await crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: HASH_ALGORITHM,
      salt: new Uint8Array(),
      info: HKDF_INFO_FINGERPRINT,
    },
    masterKey,
    { name: 'HMAC', hash: HASH_ALGORITHM, length: 256 },
    false,
    ['sign', 'verify']
  );
}

/**
 * Mengenkripsi credential (plaintext).
 */
export async function encryptInventoryPayload(payload: Record<string, string>): Promise<EncryptedPayload> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encodedPayload = new TextEncoder().encode(JSON.stringify(payload));
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM_NAME, iv },
    key,
    encodedPayload
  );

  return {
    version: ENCRYPTION_VERSION,
    algorithm: ALGORITHM_NAME,
    iv: bufferToBase64url(iv),
    ciphertext: bufferToBase64url(ciphertextBuffer),
  };
}

/**
 * Mendekripsi credential envelope kembali ke plaintext.
 */
export async function decryptInventoryPayload(encrypted: EncryptedPayload): Promise<Record<string, string>> {
  if (encrypted.version !== ENCRYPTION_VERSION || encrypted.algorithm !== ALGORITHM_NAME) {
    throw new Error('Unsupported encryption version or algorithm');
  }

  const key = await getEncryptionKey();
  const ivBuffer = base64urlToBuffer(encrypted.iv);
  const ciphertextBuffer = base64urlToBuffer(encrypted.ciphertext);

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: ALGORITHM_NAME, iv: ivBuffer },
      key,
      ciphertextBuffer
    );
    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decryptedText);
  } catch (error) {
    throw new Error('Failed to decrypt payload. The key might be incorrect or data is corrupted.');
  }
}

/**
 * Normalisasi payload untuk fingerprint agar konsisten urutannya.
 */
export function normalizeInventoryPayload(payload: Record<string, string>): string {
  const sortedKeys = Object.keys(payload).sort();
  const normalized: Record<string, string> = {};
  for (const key of sortedKeys) {
    normalized[key] = payload[key];
  }
  return JSON.stringify(normalized);
}

/**
 * Membuat HMAC fingerprint dari normalized payload untuk mencegah duplikat credential.
 */
export async function createInventoryFingerprint(payload: Record<string, string>): Promise<string> {
  const key = await getFingerprintKey();
  const normalizedString = normalizeInventoryPayload(payload);
  const encodedData = new TextEncoder().encode(normalizedString);
  
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encodedData
  );

  return bufferToBase64url(signatureBuffer);
}
