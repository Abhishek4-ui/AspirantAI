const crypto = require('crypto');

const OTP_SECRET = process.env.OTP_HASH_SECRET || 'aspirantai_otp_hmac_default_secret_key_2026';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;

/**
 * Generate cryptographically secure 6-digit numeric OTP
 */
const generateSecureOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Hash OTP with keyed HMAC SHA-256
 */
const hashOTP = (identifier, otp) => {
  return crypto
    .createHmac('sha256', OTP_SECRET)
    .update(`${identifier.trim().toLowerCase()}:${otp.trim()}`)
    .digest('hex');
};

/**
 * Verify hashed OTP against provided plain OTP
 */
const verifyHashedOTP = (identifier, inputOtp, storedHash) => {
  const calculatedHash = hashOTP(identifier, inputOtp);
  // Constant time comparison to prevent timing attacks
  const a = Buffer.from(calculatedHash, 'utf8');
  const b = Buffer.from(storedHash, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};

module.exports = {
  OTP_EXPIRY_MS,
  RESEND_COOLDOWN_MS,
  MAX_ATTEMPTS,
  generateSecureOTP,
  hashOTP,
  verifyHashedOTP
};
