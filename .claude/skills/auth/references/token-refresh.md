# Token Refresh — Implementation Reference

Full implementation of the Promise-lock refresh pattern, proactive refresh, and multi-tab sync.

---

## 1. Token Cache Module

Create `src/lib/token-cache.ts` — the single source of truth for the in-memory access token:

```typescript
// src/lib/token-cache.ts
"use client";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;
let refreshPromise: Promise<string | null> | null = null;

export function parseTokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return (payload.exp ?? 0) * 1000; // seconds → ms
  } catch { return 0; }
}

export function setCachedToken(token: string): void {
  cachedToken = token;
  tokenExpiresAt = parseTokenExpiry(token);
}

export function clearTokenCache(): void {
  cachedToken = null;
  tokenExpiresAt = 0;
  refreshPromise = null;
}

async function callRefreshEndpoint(): Promise<string | null> {
  // MUST use bare fetch — NOT httpClient — to avoid interceptor recursion.
  // The refresh token is sent automatically as an httpOnly cookie (credentials: "include").
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return null;
  const { accessToken } = await res.json();
  return accessToken;
}

/**
 * Returns a valid access token, refreshing if needed.
 *
 * Promise-lock pattern: if a refresh is already in-flight, all callers await
 * the SAME Promise rather than triggering N parallel refresh requests.
 * This handles the "10 simultaneous 401s" race condition without a queue.
 */
export async function getOrRefreshToken(): Promise<string | null> {
  const BUFFER_MS = 60_000; // refresh 60s before expiry

  // Fast path: cached token still valid
  if (cachedToken && Date.now() < tokenExpiresAt - BUFFER_MS) {
    return cachedToken;
  }

  // Lock: attach to in-flight refresh if one exists
  if (!refreshPromise) {
    refreshPromise = callRefreshEndpoint()
      .then((token) => {
        if (token) setCachedToken(token);
        else clearTokenCache();
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}
```

---

## 2. Upgraded HttpClient

Replace the hard-logout 401 handler with retry-after-refresh:

```typescript
// src/lib/http.client.ts — updated handleResponse + fetch methods

class HttpClient {
  private _refreshing = false;

  private async handleResponse<T>(
    res: Response,
    retry: () => Promise<Response>,
  ): Promise<T> {
    if (res.status === 401) {
      if (!this._refreshing) {
        this._refreshing = true;
        const newToken = await getOrRefreshToken();
        this._refreshing = false;

        if (newToken) {
          const retried = await retry();
          return this.handleResponse<T>(retried, retry);
        }
      }
      // Refresh failed or already retried — full logout
      clearTokenCache();
      clearAuthCookie(); // inline helper in http.client.ts
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = body.detail || body.title || body.message || `HTTP ${res.status}`;
      const error = Object.assign(new Error(message), {
        status: res.status,
        detail: body.detail,
        errors: body.errors,
      });
      throw error;
    }

    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text);
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    // getOrRefreshToken handles the in-memory cache lookup synchronously for valid tokens
    // For fresh requests before any token is cached, fall back to cookie read
    const token = cachedToken || readAuthCookie(); // inline helper in http.client.ts
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined | null>): Promise<T> {
    const url = this.buildUrl(path, params);
    const doFetch = () => fetch(url, { method: "GET", headers: this.getHeaders() });
    return this.handleResponse<T>(await doFetch(), doFetch);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const doFetch = () => fetch(url, { method: "POST", headers: this.getHeaders(), body: body ? JSON.stringify(body) : undefined });
    return this.handleResponse<T>(await doFetch(), doFetch);
  }

  // put, delete, postFormData: same pattern — capture doFetch as closure, pass to handleResponse
}
```

**Why the closure pattern:** `retry` is a factory function `() => Promise<Response>`. It re-reads `this.getHeaders()` on the retry call, which will now include the fresh `Authorization: Bearer <newToken>` header.

---

## 3. Next.js Route Handler for Refresh

The `/api/auth/refresh` endpoint that the browser calls. It reads the httpOnly refresh cookie and returns a new access token:

```typescript
// src/app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const REFRESH_COOKIE = "__Host-refresh_token"; // httpOnly cookie set at login

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    // Forward to your auth API
    const res = await fetch(`${process.env.API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      // Refresh token expired or revoked — clear the cookie
      const response = NextResponse.json({ error: "Refresh failed" }, { status: 401 });
      response.cookies.set(REFRESH_COOKIE, "", { maxAge: 0, path: "/" });
      return response;
    }

    const { accessToken, refreshToken: newRefreshToken } = await res.json();

    // Rotate refresh token: set new httpOnly cookie
    const response = NextResponse.json({ accessToken });
    response.cookies.set(REFRESH_COOKIE, newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Refresh error" }, { status: 500 });
  }
}
```

---

## 4. Setting the Refresh Cookie at Login

When the API returns both tokens at login, store access token in memory and refresh in httpOnly cookie via a Route Handler:

```typescript
// src/app/api/auth/login/route.ts
export async function POST(request: Request) {
  const { email, password } = await request.json();

  const res = await fetch(`${process.env.API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: body.detail || "Invalid credentials" },
      { status: res.status }
    );
  }

  const { accessToken, refreshToken } = await res.json();

  // Return access token in body (JS stores in memory)
  const response = NextResponse.json({ accessToken });

  // Set refresh token as httpOnly cookie — JS can never read this
  response.cookies.set("__Host-refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
```

> **Note:** If your API currently returns a single `token` (not separate `accessToken`/`refreshToken`), the dual-token pattern requires backend support. The current codebase returns `{ token: string }` — coordinate with the API team before implementing.

---

## 5. Proactive Refresh with JWT Expiry Decoding

The client-side JWT payload can be decoded without verification (we don't have the server's private key, and we don't need to — we just want the `exp` claim for timing):

```typescript
function parseTokenExpiry(token: string): number {
  try {
    // JWT is base64url-encoded header.payload.signature
    // atob() handles standard base64; replace url-safe chars first
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(b64));
    return (payload.exp ?? 0) * 1000;
  } catch { return 0; }
}
```

**Security note:** This decode is for timing only. Never use the decoded payload for authorization decisions client-side — always rely on the server's session validation.

---

## 6. BroadcastChannel — Multi-Tab Sync

When Tab A refreshes the token, Tab B shouldn't fire its own refresh a moment later:

```typescript
// src/lib/auth-channel.ts
"use client";

type AuthMessage =
  | { type: "TOKEN_REFRESHED"; accessToken: string }
  | { type: "LOGGED_OUT" };

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!channel) channel = new BroadcastChannel("auth_sync");
  return channel;
}

export function broadcastTokenRefreshed(accessToken: string): void {
  getChannel()?.postMessage({ type: "TOKEN_REFRESHED", accessToken } satisfies AuthMessage);
}

export function broadcastLogout(): void {
  getChannel()?.postMessage({ type: "LOGGED_OUT" } satisfies AuthMessage);
}

export function listenAuthChannel(
  onRefresh: (token: string) => void,
  onLogout: () => void,
): () => void {
  const ch = getChannel();
  if (!ch) return () => {};

  const handler = ({ data }: MessageEvent<AuthMessage>) => {
    if (data.type === "TOKEN_REFRESHED") onRefresh(data.accessToken);
    if (data.type === "LOGGED_OUT") onLogout();
  };

  ch.addEventListener("message", handler);
  return () => ch.removeEventListener("message", handler);
}
```

Usage in the refresh function:

```typescript
// In callRefreshEndpoint(), after successful refresh:
setCachedToken(newAccessToken);
broadcastTokenRefreshed(newAccessToken); // sync all other tabs

// In logout:
clearTokenCache();
broadcastLogout(); // force all tabs to /login
```

Usage in the provider:

```typescript
useEffect(() => {
  return listenAuthChannel(
    (token) => setCachedToken(token),      // Tab B receives Tab A's fresh token
    () => { window.location.href = "/login"; }  // Logout from any tab
  );
}, []);
```

---

## 7. Exponential Backoff on Refresh Failure

If the refresh endpoint fails due to a transient network error (not 401), retry with backoff before giving up:

```typescript
async function callRefreshWithRetry(retries = 2, delayMs = 500): Promise<string | null> {
  for (let i = 0; i <= retries; i++) {
    const result = await callRefreshEndpoint();
    if (result !== null) return result;
    if (i < retries) {
      await new Promise((r) => setTimeout(r, delayMs * 2 ** i)); // 500ms, 1000ms
    }
  }
  return null;
}
```

Only apply this for network-level failures. A 401 from the refresh endpoint means the refresh token is expired/revoked — don't retry, logout immediately.

---

## Checklist: Adding Refresh Support

- [ ] Backend returns `{ accessToken, refreshToken }` at `/api/v1/auth/login`
- [ ] Route handler `/api/auth/login` sets httpOnly refresh cookie, returns access token in body
- [ ] Route handler `/api/auth/refresh` reads httpOnly refresh cookie, rotates it, returns new access token
- [ ] Route handler `/api/auth/logout` clears httpOnly refresh cookie
- [ ] `src/lib/token-cache.ts` created with `getOrRefreshToken()` and `clearTokenCache()`
- [ ] `HttpClient.handleResponse` updated to call `getOrRefreshToken()` on 401 before hard logout
- [ ] `AuthRefreshProvider` schedules proactive refresh via `parseTokenExpiry`
- [ ] `BroadcastChannel` syncs token refresh across tabs
- [ ] `SessionExpiryWarning` component shows countdown at < 5min remaining
