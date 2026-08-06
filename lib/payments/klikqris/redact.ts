/**
 * Redact sensitif data sebelum disimpan ke log atau basis data.
 */
export function redactSensitiveData(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const redacted = Array.isArray(obj) ? [...obj] : { ...obj };
  const keysToRedact = [
    'x-api-key',
    'api_key',
    'authorization',
    'signature',
    'provider_signature_hash',
    'qris_image',
    'service_role',
    'access_token',
    'credential',
    'password',
    'pin',
    'two_factor',
    'license_key'
  ];

  for (const key in redacted) {
    if (Object.prototype.hasOwnProperty.call(redacted, key)) {
      if (keysToRedact.includes(key.toLowerCase())) {
        redacted[key] = '[REDACTED]';
      } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
        redacted[key] = redactSensitiveData(redacted[key]);
      }
    }
  }

  return redacted;
}
