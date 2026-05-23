---
name: http
description: HTTP layer — client vs server client selection, service objects, URL structure, error handling, params, file upload, typed responses
argument-hint: "[client | server | service | error | upload | params | unauthenticated]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# HTTP Layer

All API communication flows through one of three paths. Pick the right one before writing any code.

---

## 1. Client Decision Matrix

```
Need to fetch data or mutate?
│
├── From a feature service.ts (React Query hook calls it)
│       └── httpClient        ← always
│
├── From a Server Component directly
│       └── serverHttpClient  ← always
│
├── Auth endpoint (/api/v1/auth/*)
│       └── bare fetch        ← always (no token yet / must bypass interceptor)
│
├── Media: get presigned upload URL
│       └── getUploadUrl()    from src/lib/media.ts
│
└── Media: upload binary to S3
        └── uploadToS3()      from src/lib/media.ts
```

| Client | Location | Auth injection | 401 handling | Async headers |
|--------|----------|----------------|--------------|---------------|
| `httpClient` | `src/lib/http.client.ts` | Inline cookie read (`AUTH_COOKIE`) | Hard logout → `/login` | No (sync) |
| `serverHttpClient` | `src/lib/http.server.ts` | Inline cookie read via `next/headers` | Throws error | Yes (async) |
| Bare `fetch` | Inline in `authService` | Manual or none | Manual | N/A |
| `getUploadUrl` | `src/lib/media.ts` | Inline cookie read — manual header | Manual | No |
| `uploadToS3` | `src/lib/media.ts` | None (S3 presigned URL) | Manual | No |

---

## 2. URL Structure

```
Base URL:  env.apiUrl          (NEXT_PUBLIC_API_URL, default http://localhost:5000)

Admin API: /api/admin/v1/<resource>   ← prefix auto-prepended by httpClient / serverHttpClient
Auth API:  /api/v1/auth/*             ← no admin prefix — use bare fetch
Media API: /api/v1/media/*            ← no admin prefix — use media.ts helpers
S3:        full presigned URL         ← direct XHR PUT, no base URL
```

The clients prepend `/api/admin/v1` automatically. Service methods pass only the resource path:

```typescript
httpClient.get("/items")              // → /api/admin/v1/items
httpClient.get(`/items/${id}`)        // → /api/admin/v1/items/:id
httpClient.post("/items", body)       // → POST /api/admin/v1/items
```

The auth service bypasses the client entirely because the auth endpoints use `/api/v1/` (no `admin`):

```typescript
// src/features/auth/service.ts — bare fetch with full URL
fetch(`${env.apiUrl}/api/v1/auth/login`, { ... })
```

---

## 3. `httpClient` — Client-Side

**File:** `src/lib/http.client.ts`  
**Import:** `import { httpClient } from "@/lib/http.client";`  
**Use in:** `src/features/*/service.ts` — all feature service objects

### Methods

```typescript
httpClient.get<T>(path, params?)           // GET — params filtered, appended as query string
httpClient.post<T>(path, body?)            // POST — body JSON-serialized
httpClient.put<T>(path, body?)             // PUT
httpClient.delete<T = void>(path)          // DELETE
httpClient.postFormData<T>(path, formData) // POST multipart — do NOT set Content-Type manually
```

### Auth injection

Every request automatically gets `Authorization: Bearer <token>` via an inline `readAuthCookie()` helper in `http.client.ts` (reads the `AUTH_COOKIE` cookie from `@/config/auth`). No manual header needed in services. **lib must not import from `features/auth`** — cookie mechanics are infra, cookie semantics (login/logout/session) are domain.

### 401 handling

On 401, `httpClient` immediately:
1. Clears the `AUTH_COOKIE` cookie (inline `clearAuthCookie()` helper)
2. Hard-redirects to `/login` via `window.location.href`
3. Throws `new Error("Session expired")`

> If you add refresh token support, see `.claude/skills/auth/references/token-refresh.md` for upgrading this behavior to attempt refresh before logout.

### Params filtering

`buildUrl` automatically drops any param value that is `undefined`, `null`, or `""`:

```typescript
httpClient.get("/items", {
  search: "foo",       // ✓ included
  page: 1,             // ✓ included
  category: undefined, // ✗ omitted
  status: "",          // ✗ omitted
  active: false,       // ✓ included (false is a valid value)
})
// → /api/admin/v1/items?search=foo&page=1&active=false
```

Pass the raw filter object from the service — let the client filter it, not the service.

### Empty response handling

```typescript
// Client returns undefined for empty bodies (204 or empty text)
const result = await httpClient.put<void>("/items/123", data);  // void → undefined
const item = await httpClient.get<ItemDetail>("/items/123");    // typed response
```

---

## 4. `serverHttpClient` — Server-Side

**File:** `src/lib/http.server.ts`  
**Import:** `import { serverHttpClient } from "@/lib/http.server";`  
**Use in:** Server Components that need to pre-fetch data for SSR

### Key differences from `httpClient`

| Aspect | `httpClient` | `serverHttpClient` |
|--------|-------------|-------------------|
| Token source | Inline `readAuthCookie()` — `document.cookie` | Inline `readAuthCookie()` — Next.js `cookies()` |
| `getHeaders()` | Sync | **Async** — must `await` internally |
| 401 handling | Clears token + redirect | **Throws** — no redirect (server context) |
| Empty response | Checks `res.text()` length | Checks `res.status === 204` |
| Cache | Default fetch cache | Always `cache: "no-store"` |
| `postFormData` | Supported | Not available |

### Usage in Server Components

```tsx
// Server Component — data fetched server-side before rendering
export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = await serverHttpClient.get<ItemDetail>(`/items/${params.id}`);
  return <ItemDetailView item={item} />;
}
```

### When to prefer `serverHttpClient` over client-side fetching

- Initial page data that should be in the HTML (SEO, no loading flash)
- Data only needed on the server (e.g. for `generateMetadata`)
- Sensitive operations that shouldn't expose the token to the browser

### Error handling on the server

`serverHttpClient` does not auto-redirect on 401 — it throws. Handle in the calling component:

```typescript
// Unhandled throws propagate to the nearest error.tsx boundary
const item = await serverHttpClient.get<ItemDetail>(`/items/${id}`);
// If 401: Next.js error boundary catches it

// Or handle explicitly:
try {
  const item = await serverHttpClient.get<ItemDetail>(`/items/${id}`);
} catch (err) {
  const error = err as Error & { status?: number };
  if (error.status === 404) notFound(); // Next.js built-in
  throw err;
}
```

---

## 5. Bare `fetch` — Unauthenticated Endpoints

Use directly for:
- Auth endpoints (`/api/v1/auth/login`, `/api/v1/auth/me`)
- The token refresh Route Handler (`/api/auth/refresh`) — **must** bypass `httpClient` to avoid 401 recursion

```typescript
// Always use full URL (env.apiUrl + path) — no prefix auto-added
const res = await fetch(`${env.apiUrl}/api/v1/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

if (!res.ok) {
  const body = await res.json().catch(() => ({}));
  throw new Error(body.detail || body.title || "Request failed");
}

return res.json();
```

**With auth header (manual):**

Prefer `useAuth()` / `useSession()` from `@/features/auth` for any UI-level "am I signed in" check. Only reach for a raw `fetch("/auth/me")` from inside the auth feature itself (see `authService.me()`).

---

## 6. Service Object Pattern

Every feature has one service object in `src/features/<name>/service.ts`. All methods are pure API calls — no state, no toast, no logic.

```typescript
// src/features/<name>/service.ts
import { httpClient } from "@/lib/http.client";
import type { PaginatedResponse } from "@/types/common";
import type { CreateItemInput, ItemListFilter, UpdateItemInput } from "./schema";
import type { ItemDetail, ItemListItem } from "./types";

export const itemService = {
  // Collection
  async getAll(filter: ItemListFilter = {}): Promise<PaginatedResponse<ItemListItem>> {
    return httpClient.get("/items", {
      search: filter.search,
      status: filter.status,
      page: filter.page ?? 1,
      pageSize: filter.pageSize ?? 20,
    });
  },

  // Single resource
  async getById(id: string): Promise<ItemDetail> {
    return httpClient.get(`/items/${id}`);
  },

  // Create → returns the new resource's id
  async create(data: CreateItemInput): Promise<{ id: string }> {
    return httpClient.post("/items", data);
  },

  // Update → void (204 No Content)
  async update(id: string, data: UpdateItemInput): Promise<void> {
    return httpClient.put(`/items/${id}`, data);
  },

  // Delete → void
  async delete(id: string): Promise<void> {
    return httpClient.delete(`/items/${id}`);
  },

  // Action endpoints (state transitions)
  async publish(id: string): Promise<void> {
    return httpClient.post(`/items/${id}/publish`);
  },

  async archive(id: string): Promise<void> {
    return httpClient.post(`/items/${id}/archive`);
  },

  // Sub-resource
  async addTag(id: string, data: AddTagInput): Promise<{ id: string }> {
    return httpClient.post(`/items/${id}/tags`, data);
  },

  async removeTag(id: string, tagId: string): Promise<void> {
    return httpClient.delete(`/items/${id}/tags/${tagId}`);
  },

  // Utility / validation
  async checkSlug(slug: string): Promise<{ available: boolean }> {
    return httpClient.get("/items/slug/check", { slug });
  },
};
```

**Rules:**
- Export a named object (not standalone functions)
- Methods are `async` returning typed promises
- No try/catch — errors propagate to mutation `onError`
- No `toast`, no `router`, no React hooks
- Default filter params (page, pageSize) set in service, not hook

---

## 7. Error Handling

### Error shape thrown by `httpClient`

```typescript
// httpClient enriches errors with extra fields:
interface ApiError extends Error {
  message: string;            // body.detail || body.title || body.message || "HTTP 422"
  status: number;             // HTTP status code
  detail?: string;            // body.detail (API error description)
  errors?: Record<string, string[]>; // body.errors (field-level validation errors)
}
```

### Error shape thrown by `serverHttpClient`

```typescript
// serverHttpClient has slightly different extraction:
interface ServerApiError extends Error {
  message: string;            // body.title || body.message || "HTTP 422" (no body.detail)
  status: number;
  errors?: Record<string, string[]>;
}
// NOTE: serverHttpClient misses body.detail extraction — patch if needed:
// const message = body.detail || body.title || body.message || `HTTP ${res.status}`;
```

### Catching in mutation hooks

```typescript
// In hooks.ts — error is always typed as Error
onError: (error: Error) => {
  toast.error(error.message || "Operation failed");
},
```

### Catching in Server Components

```typescript
try {
  const data = await serverHttpClient.get<ItemDetail>(`/items/${id}`);
} catch (err) {
  const error = err as Error & { status?: number };
  if (error.status === 404) notFound();   // Next.js — renders not-found.tsx
  if (error.status === 403) redirect("/overview"); // permission denied
  throw error; // let error boundary handle the rest
}
```

### Field-level validation errors

When the API returns a 422 with `errors` map, surface per-field messages with react-hook-form:

```typescript
onError: (error: Error) => {
  const apiError = error as ApiError;
  if (apiError.errors) {
    Object.entries(apiError.errors).forEach(([field, messages]) => {
      form.setError(field as keyof FormInput, { message: messages[0] });
    });
    return;
  }
  toast.error(error.message || "Validation failed");
},
```

---

## 8. `postFormData` — Multipart Requests

For submitting `FormData` (e.g. CSV import, legacy file endpoints that aren't S3-backed):

```typescript
// Service method
async importCsv(file: File): Promise<{ imported: number }> {
  const formData = new FormData();
  formData.append("file", file);
  return httpClient.postFormData("/items/import", formData);
},
```

**Critical:** Do NOT manually set `Content-Type` on FormData requests. The browser must set it automatically to include the multipart boundary:

```typescript
// WRONG — breaks multipart parsing
headers["Content-Type"] = "multipart/form-data"; // ← don't do this

// CORRECT — httpClient.postFormData omits Content-Type intentionally
// Browser: Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
```

---

## 9. Media / File Upload

For user-uploaded images and media assets — always use the presigned S3 flow, not `postFormData`.

**File:** `src/lib/media.ts`

```typescript
import { getUploadUrl, uploadToS3 } from "@/lib/media";

// Step 1: Get a presigned upload URL from the API
const { assetId, uploadUrl, assetKey, publicUrl } = await getUploadUrl(
  file.name,
  file.type, // e.g. "image/jpeg"
);

// Step 2: Upload the binary directly to S3 (with progress)
await uploadToS3(uploadUrl, file, (percent) => {
  setProgress(percent); // 0–100
});

// Step 3: Register the uploaded asset with the API via service
await itemService.attachMedia(itemId, assetId, {
  s3Key: assetKey,
  previewUrl: publicUrl,
  sourceUrl: publicUrl,
  isPrimary: true,
  mediaType: "Image",
});
```

### `getUploadUrl` internals

```typescript
// Uses /api/v1/media/upload-url — NOT the admin prefix
// Manual Bearer token injection (not httpClient)
GET /api/v1/media/upload-url?fileName=photo.jpg&contentType=image%2Fjpeg
Authorization: Bearer <token>
→ { assetId, uploadUrl, assetKey, publicUrl }
```

### `uploadToS3` internals

```typescript
// Direct PUT to the presigned S3 URL — no API base URL, no auth header
// Uses XHR (not fetch) to support upload progress events
PUT <presigned-s3-url>
Content-Type: image/jpeg
Body: <binary>
```

### `s3KeyFromUrl` utility

```typescript
import { s3KeyFromUrl } from "@/lib/media";

// Extract the S3 key from a public CDN URL (for deletion requests)
const key = s3KeyFromUrl("https://cdn.example.com/uploads/photo.jpg");
// → "uploads/photo.jpg"
```

---

## 10. Typed Response Conventions

Always provide the generic type parameter. Never use `any`:

```typescript
// ✓ Correct
const items = await httpClient.get<PaginatedResponse<ItemListItem>>("/items");
const item = await httpClient.get<ItemDetail>(`/items/${id}`);
const result = await httpClient.post<{ id: string }>("/items", data);
await httpClient.put<void>(`/items/${id}`, data);       // void = 204 / empty body
await httpClient.delete<void>(`/items/${id}`);

// ✗ Wrong
const items = await httpClient.get("/items");            // untyped → implicit any
const result = await httpClient.post<any>("/items", data); // explicit any
```

Return type of service methods must match the `httpClient` call:

```typescript
async getAll(filter = {}): Promise<PaginatedResponse<ItemListItem>> {
  return httpClient.get<PaginatedResponse<ItemListItem>>("/items", filter);
  //                 ↑ same type as return type annotation ↑
}
```

---

## 11. `PaginatedResponse<T>` Shape

```typescript
// src/types/common.ts
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}
```

Service methods returning paginated data must type their return as `Promise<PaginatedResponse<T>>`. Hooks destructure `.items`, `.totalPages`, etc. directly from `data`.

---

## 12. Adding a New Endpoint — Checklist

1. **Check `docs/swagger.json`** — confirm the endpoint path, method, request body, and response shape
2. **Add type to `types.ts`** if the response is a new shape
3. **Add schema to `schema.ts`** if the request body needs form validation
4. **Add method to `service.ts`** — pure API call, typed, no logic
5. **Add hook to `hooks.ts`** — `useQuery` or `useMutation` with toast + invalidation
6. **Export from `index.ts`** if it's a new export

---

## Anti-Patterns

| Wrong | Right |
|-------|-------|
| `fetch(...)` directly in a component | Service method → hook → component |
| `httpClient` for `/api/v1/auth/*` endpoints | Bare `fetch` with full URL |
| `serverHttpClient` inside `service.ts` | `httpClient` in services; `serverHttpClient` in Server Components |
| Manual URL construction: `` `${env.apiUrl}/api/admin/v1/items` `` | `httpClient.get("/items")` — prefix is automatic |
| Filtering `undefined` params before passing to client | Pass raw filter object — client filters `undefined/null/""` |
| `httpClient.get<any>(...)` | Always provide the exact return type |
| `content-type: multipart/form-data` set manually | Let browser set it for FormData — use `postFormData` |
| `postFormData` for media uploads | Presigned S3 via `getUploadUrl` + `uploadToS3` |
| `try/catch` in service methods | Let errors propagate to mutation `onError` |
| `toast.error(...)` in service methods | Toast lives in hooks `onError`, never in services |
| Building logic or state in service methods | Services are pure API calls — logic belongs in hooks |
