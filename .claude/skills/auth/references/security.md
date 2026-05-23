# Auth Security Hardening Reference

OWASP-aligned security controls for the auth system. Applies to admin tools with JWT + cookie-based sessions.

---

## 1. Cookie Attribute Matrix

Every auth cookie must be audited against this table:

| Attribute | Access token cookie | Refresh token cookie | Rationale |
|-----------|--------------------|--------------------|-----------|
| `HttpOnly` | ❌ No | ✅ Required | Access token must be JS-readable for `Authorization: Bearer`; refresh must never be exposed to JS |
| `Secure` | ✅ Required | ✅ Required | HTTPS only; prevents cleartext transmission |
| `SameSite=Lax` | ✅ | ✅ | Blocks cross-site XHR/fetch CSRF; allows top-level navigations (bookmark/email links) |
| `Path=/` | ✅ | ✅ | Scope to entire app, not sub-path |
| `Max-Age` | Per token lifetime | Per refresh lifetime | Prefer `Max-Age` over `Expires` — client clock-independent |
| `__Host-` prefix | Recommended | ✅ Required | Enforces `Secure + Path=/ + no Domain` — prevents subdomain injection |

### `__Host-` Cookie Prefix

```
Set-Cookie: __Host-refresh_token=<value>; Secure; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800
```

The `__Host-` prefix enforces three invariants the browser will reject if violated:
1. Must have `Secure` flag
2. Must have `Path=/`
3. Must NOT have a `Domain=` attribute

This prevents a subdomain-injection attack where an attacker controlling `evil.yourapp.com` sets a cookie that the browser would send to `yourapp.com`.

**Do NOT use `__Host-` when:**
- Your app is served from a sub-path (e.g. `yourapp.com/admin/`) — `Path=/` would conflict
- You need cross-subdomain cookie sharing

### Current codebase status

```typescript
// src/features/auth/hooks.ts — CURRENT (access token, private writeToken helper)
`${AUTH_COOKIE}=${token}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax${secure}`
// Missing: HttpOnly (intentional — JS needs to read it)
// OK: SameSite=Lax, Secure in prod, path=/
```

To upgrade the refresh token when dual-token support is added:
```typescript
// Set via Next.js Route Handler (server-side — can set HttpOnly)
response.cookies.set("__Host-refresh_token", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
});
```

---

## 2. CSRF Protection

### Why SameSite=Lax alone is insufficient

`SameSite=Lax` blocks cross-site sub-resource requests but NOT:
- Requests from same-site but different subdomain (`evil.yourapp.com`)
- Requests that originate from top-level navigation (GET-triggered mutations — avoid these)
- Old browsers with no SameSite support (rare in 2026 admin tools, but worth defense-in-depth)

### Recommended: `Sec-Fetch-Site` server-side check

Modern browsers send `Sec-Fetch-Site` on every request. This header cannot be forged by cross-origin JavaScript:

```typescript
// In your API server or Next.js middleware for state-mutating endpoints:
const secFetchSite = request.headers.get("Sec-Fetch-Site");
// Allow: "same-origin", "same-site", "none" (direct navigation/non-browser)
// Reject: "cross-site"
if (secFetchSite === "cross-site") {
  return new Response("Forbidden", { status: 403 });
}
```

This is a zero-cost CSRF defense that requires no tokens or extra round-trips.

### Signed Double-Submit Cookie (stateless CSRF token)

For defense in depth when you can't rely on `Sec-Fetch-Site`:

```typescript
// Server generates: CSRF token = HMAC-SHA256(sessionId, serverSecret)
// Stores in non-httpOnly cookie: __Secure-csrf=<token>; Secure; SameSite=Strict
// Client reads cookie, sends as header: X-CSRF-Token: <token>
// Server validates: recompute HMAC, compare — no session storage needed

// Example middleware validation
const csrfCookie = request.cookies.get("__Secure-csrf")?.value;
const csrfHeader = request.headers.get("x-csrf-token");
const expected = hmacSha256(getSessionId(request), process.env.CSRF_SECRET);
if (!csrfCookie || !csrfHeader || csrfCookie !== expected || csrfHeader !== expected) {
  return new Response("Invalid CSRF token", { status: 403 });
}
```

The `SameSite=Strict` on the CSRF cookie ensures it's never sent cross-site, preventing CSRF-of-the-CSRF-cookie. Since it's not httpOnly, the same-site JS can read it.

---

## 3. OWASP Token Fingerprinting

Binds the JWT to the browser so a stolen token is useless without the corresponding cookie.

**Flow:**
1. At login, server generates a 128-bit random string (fingerprint)
2. Server stores `SHA-256(fingerprint)` as the `fp` claim inside the JWT
3. Server sends the raw fingerprint as `__Host-fp` — `httpOnly; Secure; SameSite=Strict`
4. On every request, server re-derives `SHA-256(__Host-fp cookie)` and compares to `fp` claim
5. A stolen JWT without the `__Host-fp` cookie → fingerprint mismatch → 401

```typescript
// Login: server side (your API)
const fingerprint = crypto.randomBytes(16).toString("hex"); // 128-bit
const fpHash = crypto.createHash("sha256").update(fingerprint).digest("hex");

// Embed fpHash in JWT payload
const token = jwt.sign({ userId, role, fp: fpHash }, secret, { expiresIn: "15m" });

// Set fingerprint cookie (httpOnly, Strict so XSS can't steal it even from same site)
response.headers["Set-Cookie"] = `__Host-fp=${fingerprint}; Secure; HttpOnly; SameSite=Strict; Path=/`;
```

```typescript
// Every API request: server validates fingerprint
const fpCookie = request.cookies["__Host-fp"];
const fpHash = crypto.createHash("sha256").update(fpCookie ?? "").digest("hex");
const decoded = jwt.verify(token, secret); // throws if invalid
if (decoded.fp !== fpHash) throw new UnauthorizedException("Fingerprint mismatch");
```

**Why this works:** XSS can steal the access token from memory or JS-readable cookie. But `__Host-fp` is httpOnly + SameSite=Strict — XSS cannot exfiltrate it. The stolen JWT is useless without the fingerprint.

---

## 4. Token Revocation

JWTs are stateless — valid until expiry even after logout. Options by complexity:

### A. Short lifetimes (current best-effort)

15-minute access tokens limit the revocation gap to 15 minutes after logout. Acceptable for most admin tools if combined with server-side refresh token invalidation at logout.

### B. Refresh token server-side invalidation at logout

```typescript
// On logout, backend marks the refresh token as revoked in DB/Redis
// Any subsequent refresh attempt with that token → 401
// Implementation depends on your API — coordinate with backend
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
Body: { refreshToken }  // or read from httpOnly cookie server-side
```

### C. Token version in user record (versioned tokens)

```typescript
// user.tokenVersion incremented on logout / password change
// JWT payload includes: { userId, tokenVersion: 3, ... }
// Server reads user.tokenVersion from DB and rejects tokens with stale version
// Cost: 1 DB read per authenticated request
```

### D. Denylist (Redis TTL)

```typescript
// On logout: store SHA-256(accessToken) in Redis with TTL = token remaining lifetime
// On every request: check if token hash is in denylist
// Cost: 1 Redis read per request (fast, ~0.1ms)
// Automatically expires — no cleanup needed
```

---

## 5. JWT Signing Algorithm

| Algorithm | Type | Use when |
|-----------|------|----------|
| HS256 | Symmetric | Single service; secret must be ≥64 chars, cryptographically random |
| RS256 | Asymmetric | Multiple services; only auth service can sign, others only verify |
| ES256 | Asymmetric | Smaller tokens than RS256; same security properties |

**Never accept `alg: "none"`** — always pin the algorithm server-side:
```typescript
jwt.verify(token, secret, { algorithms: ["RS256"] }); // reject anything else
```

---

## 6. CVE-2025-29927 — Next.js Middleware Bypass

All Next.js versions before **14.2.25** and **15.2.3** allowed attackers to bypass middleware entirely by sending a crafted `x-middleware-subrequest` header, gaining access to all "protected" routes.

**Defense (already in this codebase):** `requireSession()` in the dashboard layout calls `/api/v1/auth/me` — this is the real auth gate. Middleware is just an optimization to avoid serving the full dashboard shell to unauthenticated requests. Even if middleware were bypassed, `requireSession()` would catch it.

**Never** rely solely on middleware for authentication. Always validate the session in the server-side layout.

---

## 7. Content Security Policy for Admin Apps

Admin tools have stricter CSP needs than public apps (no user-generated content, no embedded third-party widgets):

```typescript
// src/middleware.ts — add CSP header
const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

const cspHeader = [
  "default-src 'self'",
  `script-src 'nonce-${nonce}' 'strict-dynamic'`, // nonce-based, no unsafe-inline
  "style-src 'self' 'unsafe-inline'",             // Tailwind requires this; tighten if possible
  "img-src 'self' data: blob: https:",            // allow S3/CDN images
  "connect-src 'self' https:",                    // API calls
  "font-src 'self'",
  "object-src 'none'",                            // no Flash, no plugins
  "base-uri 'none'",                              // prevents base tag injection
  "frame-ancestors 'none'",                       // prevents clickjacking
].join("; ");

const response = NextResponse.next();
response.headers.set("Content-Security-Policy", cspHeader);
response.headers.set("X-Content-Type-Options", "nosniff");
response.headers.set("X-Frame-Options", "DENY");
response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
response.headers.set(
  "Strict-Transport-Security",
  "max-age=63072000; includeSubDomains; preload", // HSTS — 2-year preload
);
return response;
```

Pass the nonce to Next.js via a request header so Server Components can inject it into `<script>` tags:
```typescript
request.headers.set("x-nonce", nonce);
```

---

## 8. HSTS

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

Ensures all traffic is HTTPS, prevents protocol-downgrade attacks that could intercept `Secure` cookies. The current deployment (CloudFront) should set this on all responses. Verify it's present in production response headers.

---

## Security Checklist

### Cookie audit
- [ ] Access token: `Secure; SameSite=Lax; path=/` — no `HttpOnly` (JS needs to read)
- [ ] Refresh token: `HttpOnly; Secure; SameSite=Lax; path=/; __Host-` prefix
- [ ] No `Domain=` attribute on sensitive cookies

### CSRF
- [ ] `SameSite=Lax` on session cookies
- [ ] Server checks `Sec-Fetch-Site !== "cross-site"` for all mutations

### Token handling
- [ ] Short-lived access tokens (≤15 min)
- [ ] Refresh token invalidated server-side on logout
- [ ] JWT algorithm pinned (e.g. `{ algorithms: ["RS256"] }`)
- [ ] `alg: none` rejected

### XSS mitigation
- [ ] Refresh token in httpOnly cookie
- [ ] CSP header deployed (`script-src nonce-based`)
- [ ] `X-Content-Type-Options: nosniff`

### Infrastructure
- [ ] HSTS deployed (via CloudFront or Next.js headers)
- [ ] `X-Frame-Options: DENY` or `frame-ancestors 'none'` in CSP
- [ ] Next.js version ≥ 14.2.25 / 15.2.3 (CVE-2025-29927 patched)
- [ ] `requireSession()` in layout — never rely solely on middleware

### Logout completeness
- [ ] Client: clear in-memory access token, delete access cookie (`max-age=0`)
- [ ] Client: POST `/api/auth/logout` with `credentials: "include"`
- [ ] Server: invalidate/rotate refresh token
- [ ] Client: `window.location.href = "/login"` (hard redirect)
- [ ] Multi-tab: `BroadcastChannel` logout message to force all tabs to `/login`
