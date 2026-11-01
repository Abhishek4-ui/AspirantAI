# AspirantAI Security Architecture

## 1. Authentication & Cryptography
- **Password Protection**: Passwords are encrypted using salted bcrypt hashing (`pre('save')` hooks). Plaintext passwords are never stored or returned in query results (`select: false`).
- **Cryptographic OTPs**: Generated using `crypto.randomInt(100000, 999999)` and stored only as HMAC SHA-256 hashes keyed with a server-side secret (`OTP_HASH_SECRET`).
- **Replay Attack Prevention**: OTP challenges are marked `isUsed: true` immediately upon successful verification. Replay attempts are rejected.
- **Timing Safe Comparison**: Verified using `crypto.timingSafeEqual` to thwart timing side-channel attacks.
- **Rate Limiting**: Strict limits (30 attempts / 15 mins) on authentication and challenge endpoints via `express-rate-limit`.

## 2. Server-Authoritative Scoring & Integrity
- Questions delivered during an active test never leak `correctAnswer` or `explanation` payloads to the client.
- The scoring engine evaluates responses strictly on the server against database truth.
- Configurable negative marking (-0.66) is enforced deterministically.
- Idempotent quiz submissions reject score re-submission attempts.

## 3. Role-Based Access Control (RBAC)
- Roles: `student`, `contentManager`, `admin`.
- Middleware `protect` verifies JWT tokens.
- Middleware `authorize(...roles)` blocks unauthorized route access with HTTP 403.
- Content managers and students cannot self-escalate privileges.
