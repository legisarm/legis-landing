---
name: auth
description: Authentication implementation — login/logout, token lifecycle, session validation, refresh, route protection, invitation flow, UX patterns
argument-hint: "[login | logout | refresh | session | protect | invite | security]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Auth

Full authentication reference for this codebase. Before implementing any auth feature, read the relevant section below and the reference docs linked at the end.

---

## Architecture Overview

```
Browser                    Next.js Server              External API
───────────────────────    ─────────────────────────   ──────────────────────
[Login form]
  └─ POST /api/v1/auth/login ──────────────────────→ Returns { token }
  └─ token written to auth_token cookie (SameSite=Lax)

[Every API request]
  └─ httpClient reads auth_token cookie → Authorization: Bearer <token>
  └─ httpClient.get/post/put/delete ─────────────→ /api/admin/v1/...
  └─ 401 response → clears cookie → window.location.href = "/login"

[Server Component render]
  ← middleware: cookie present? → pass through
  ← layout: requireSession() → GET /api/v1/auth/me → Session | redirect
  ← React cache() deduplicates across all Server Components in same render
```

### File Map

All auth domain logic lives in `src/features/auth/`. `src/lib/` contains only HTTP infrastructure that happens to read the auth cookie inline.

| File | Responsibility |
|------|---------------|
| `src/config/auth.ts` | `AUTH_COOKIE`, `AUTH_COOKIE_MAX_AGE` — shared constants only |
| `src/features/auth/schema.ts` | Zod schemas: `loginSchema`, `acceptInvitationSchema` |
| `src/features/auth/types.ts` | `LoginResponse`, `Session` |
| `src/features/auth/service.ts` | Bare `fetch` calls: `login()`, `me()`, `acceptInvitation()` |
| `src/features/auth/hooks.ts` | React Query: `useAuth`, `useSession`, `useLogin`, `useLogout`, `useAcceptInvitation`. Also holds the client-side cookie writers (`writeToken`, `deleteToken`) — private to this file. |
| `src/features/auth/server.ts` | `"server-only"`: `getSession` (cached), `requireSession` |
| `src/features/auth/index.ts` | Barrel — **does not** export `server.ts` (server-only) |
| `src/lib/http.client.ts` | `HttpClient` — reads `AUTH_COOKIE` inline, handles 401 |
| `src/lib/http.server.ts` | `ServerHttpClient` — reads `AUTH_COOKIE` via `next/headers` |
| `src/lib/media.ts` | S3 presigned URL fetch — reads `AUTH_COOKIE` inline |
| `src/middleware.ts` | Edge: redirects unauthenticated → `/login` |
| `src/app/(public)/login/` | Login page — uses `useAuth` for session check |
| `src/app/(public)/accept-invitation/` | Invitation activation page |
| `src/app/(dashboard)/layout.tsx` | `requireSession()` — authoritative auth gate |

### Layering rules

- **`features/auth`** owns all auth domain logic (session state, login/logout hooks, token lifecycle, server-side session guard).
- **`lib/http.*` and `lib/media.ts`** read the cookie inline using the constant from `config/auth.ts`. They know cookie *mechanics*, not auth *semantics*. They must **never** import from `features/auth`.
- **App code** only imports from `@/features/auth` (client) or `@/features/auth/server` (server). It never imports cookie helpers directly.

---

## 1. Public API (Client)

Everything app code needs is in `@/features/auth`:

```typescript
import {
  useAuth,              // composed: { user, isAuthenticated, isLoading, login, logout }
  useSession,           // React Query hook for current session
  useLogin,             // mutation — login + cookie write + redirect
  useLogout,            // mutation — cookie clear + redirect + query cache clear
  useAcceptInvitation,  // mutation — invitation activation
  loginSchema,          // Zod
  acceptInvitationSchema,
  type Session,
  type LoginInput,
  type LoginResponse,
} from "@/features/auth";
```

**For Server Components only:**

```typescript
import { requireSession, getSession } from "@/features/auth/server";
```

Never import these from a Client Component — the `"server-only"` marker will fail the build.

### `useAuth` — the primary hook

```tsx
"use client";
import { useAuth } from "@/features/auth";

export function HeaderMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <>
      <span>{user?.email}</span>
      <Button onClick={() => logout.mutate()}>Sign out</Button>
    </>
  );
}
```

Under the hood, `useAuth` composes `useSession()` (React Query hook that calls `authService.me()`) + `useLogin()` + `useLogout()`. The session query key is `["auth", "session"]` with `staleTime: 60s` and `retry: false`.

---

## 2. Token Storage

### Current: single readable cookie

Cookie name & max-age are in `src/config/auth.ts`:

```typescript
export const AUTH_COOKIE = "auth_token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
```

Cookie **writers** live privately inside `src/features/auth/hooks.ts` (called only by `useLogin`/`useLogout`). Cookie **readers** are inlined in the HTTP clients and `media.ts` — three tiny copies of the same 3-line match, each gated on their own module concerns.

```typescript
// features/auth/hooks.ts — private helpers
function readToken(): string | null { ... }
function writeToken(token: string): void { ... }
function deleteToken(): void { ... }
```

**Characteristics:**
- Not `httpOnly` — readable from JS (required so `HttpClient` can inject `Authorization: Bearer`)
- `SameSite=Lax` — safe against cross-site fetch/XHR CSRF; sent on top-level navigations
- `Secure` in production — HTTPS only
- 7-day lifetime — single long-lived token (no refresh currently)

### Recommended evolution: dual-token

When adding refresh support (see `references/token-refresh.md`):

| Token | Storage | Lifetime | JS-readable |
|-------|---------|----------|-------------|
| Access token | In-memory module variable | 15 min | Yes (for `Authorization: Bearer`) |
| Refresh token | `httpOnly; Secure; SameSite=Lax; __Host-` cookie | 7 days | No — XSS-proof |

---

## 3. Login Flow

```typescript
// src/features/auth/hooks.ts
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data.email, data.password),
    onSuccess: (response) => {
      writeToken(response.token);
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      // Hard navigation — forces server to see new cookie on first request.
      // NEVER use router.push() here: soft navigation serves stale SSR cache.
      window.location.href = "/overview";
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });
}
```

```typescript
// src/features/auth/service.ts — bare fetch, not httpClient (no token yet at login)
export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> { ... },
  async me(token: string): Promise<Session> { ... },
  async acceptInvitation(token: string, password: string): Promise<void> { ... },
};
```

**Login page — use `useAuth` for existing-session check:**

```tsx
"use client";
import { type LoginInput, loginSchema, useAuth } from "@/features/auth";

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) window.location.href = "/overview";
  }, [isAuthenticated]);

  if (isLoading || isAuthenticated) return <LoginSkeleton />;

  return <form onSubmit={form.handleSubmit((d) => login.mutate(d))}>...</form>;
}
```

Do NOT manually call `fetch("/api/v1/auth/me")` in page components — that responsibility belongs to `useSession` inside the feature.

---

## 4. Logout Flow

```typescript
// src/features/auth/hooks.ts
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      deleteToken();
      queryClient.clear();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Hard navigation clears all client state, forces fresh server render
      window.location.href = "/login";
    },
  });
}
```

**Logout button:**

```tsx
const { logout } = useAuth();
<Button variant="ghost" onClick={() => logout.mutate()} disabled={logout.isPending}>
  Sign Out
</Button>
```

---

## 5. Session Validation — Server Side

### Architecture layers

```
1. middleware.ts                 — presence check only (cookie exists?)
2. (dashboard)/layout.tsx        — requireSession() — actual API validation
3. Any Server Component          — getSession() — cached, free after layout validated it
```

```typescript
// src/features/auth/server.ts
import "server-only";

export interface Session { id, email, role, isActive }

// Wrapped in React cache() — one HTTP call per render pass, regardless of how many
// Server Components call it. Cache is per-request, not global.
export const getSession = cache(async (): Promise<Session | null> => { ... });

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
```

### Dashboard layout

```tsx
// src/app/(dashboard)/layout.tsx
import { requireSession } from "@/features/auth/server";

export default async function DashboardLayout({ children }) {
  const session = await requireSession(); // redirects if invalid
  return <DashboardShell userEmail={session.email} userRole={session.role}>{children}</DashboardShell>;
}
```

### Using session in Server Components

```tsx
import { getSession } from "@/features/auth/server";

export default async function SettingsPage() {
  const session = await getSession(); // hits cache, no extra HTTP call
  return <div>Logged in as {session?.email}</div>;
}
```

---

## 6. Middleware — Route Protection

```typescript
// src/middleware.ts
import { AUTH_COOKIE } from "@/config/auth";

const publicPaths = ["/login", "/accept-invitation"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Only guard: no cookie → redirect to /login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CRITICAL: do NOT redirect authenticated users away from /login here.
  // requireSession() may redirect to /login (expired token) →
  // middleware would then redirect back → 307 infinite loop.
  return NextResponse.next();
}
```

**The 307 redirect loop — explained:**
```
[expired token cookie]
  → User navigates to /overview
  → middleware: token cookie exists → passes through ✓
  → requireSession(): GET /api/v1/auth/me → 401 → returns null → redirect("/login")
  → IF middleware redirected token+/login → /overview: redirect back → infinite loop

FIX: middleware never redirects token-present users away from /login.
     Login page handles the "already authenticated" case via useAuth (client-side).
```

---

## 7. HttpClient — 401 Handling

### Current behavior (immediate logout)

```typescript
// src/lib/http.client.ts — handleResponse
if (res.status === 401) {
  clearAuthCookie();
  window.location.href = "/login";
  throw new Error("Session expired");
}
```

`clearAuthCookie` is a private helper inside `http.client.ts` — lib does NOT import from features.

### Upgraded behavior (attempt refresh first)

See `references/token-refresh.md` for the full Promise-lock implementation. When adding refresh:
- Refresh logic can live in `features/auth/` (domain); expose a `getOrRefreshToken()` helper.
- `http.client.ts` still does not import from features — instead, expose a tiny *setter* the feature calls at app boot to inject the refresh handler. Keep the default no-op so lib remains self-contained.

---

## 8. Proactive Refresh

Don't wait for 401s. Refresh the token ~60 seconds before it expires. Implementation lives in `features/auth/` (client-side provider). See `references/token-refresh.md` for full pattern.

---

## 9. Session Expiry Warning UI

Show a warning when the session has < 5 minutes remaining. Component lives under `components/common/` and consumes `useAuth`. Full example in `references/token-refresh.md`.

---

## 10. Invitation / Account Activation Flow

```typescript
// src/features/auth/schema.ts
export const acceptInvitationSchema = z.object({
  password: z.string().min(8, "At least 8 characters"),
  confirmPassword: z.string().min(1, "Required"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// src/features/auth/hooks.ts
export function useAcceptInvitation() {
  return useMutation({
    mutationFn: ({ token, password }) => authService.acceptInvitation(token, password),
    onSuccess: () => toast.success("Account activated"),
    onError: (error: Error) => toast.error(error.message || "Activation failed"),
  });
}
```

---

## 11. Role-Based Access (RBAC)

The `Session` type exposes `role: "Admin" | "Editor"`. Use it to gate UI and actions:

```typescript
// Server Component — gate entire page
import { requireSession } from "@/features/auth/server";
const session = await requireSession();
if (session.role !== "Admin") redirect("/overview");

// Client Component — gate UI elements
const { user } = useAuth();
{user?.role === "Admin" && (
  <Button variant="destructive" onClick={() => deleteItem.mutate(id)}>Delete</Button>
)}
```

---

## Anti-Patterns

| Wrong | Right |
|-------|-------|
| `router.push("/overview")` after login | `window.location.href = "/overview"` |
| `router.push("/login")` after logout | `window.location.href = "/login"` |
| Redirecting token-present users in middleware | Login page handles via `useAuth` client-side |
| Relying solely on middleware for auth | `requireSession()` in layout is the authoritative gate |
| `fetch("/api/v1/auth/me")` inline in a page | Use `useSession()` / `useAuth()` from the feature |
| `lib/*` importing from `features/auth` | Inline the 3-line cookie read in lib using `config/auth` |
| Importing `@/features/auth/server` in a Client Component | Only import from `@/features/auth` (client barrel) |
| Duplicating `AUTH_COOKIE` as a string literal | Import from `@/config/auth` |
| Calling `httpClient` for the refresh request | Bare `fetch()` — avoids interceptor recursion |
| Reading refresh token from JS | Refresh token must be httpOnly — never JS-readable |
| `toast()` inside component submit handler | `toast()` inside mutation `onSuccess/onError` |

---

## Reference Docs

- **Token refresh implementation** (Promise lock, proactive refresh, BroadcastChannel): `.claude/skills/auth/references/token-refresh.md`
- **Security hardening** (cookie attributes, CSRF, fingerprinting, OWASP): `.claude/skills/auth/references/security.md`