---
name: tanstack
description: TanStack Query v5 patterns, DataTable + Pagination, filter/pagination state management aligned with this codebase
argument-hint: "[query | table | filter | mutation | pagination]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# TanStack

Covers **TanStack Query v5** (the only TanStack package installed) and the project's custom **DataTable + Pagination** components. `@tanstack/react-table` is **not installed** — use the custom DataTable for all table needs.

---

## Package Versions

```json
"@tanstack/react-query": "^5.75.5"
```

---

## 1. QueryClient Setup

**File:** `src/providers/QueryProvider.tsx`

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,  // 60s global default
            retry: 1,
          },
        },
      }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

**Rules:**
- `useState(() => new QueryClient(...))` — factory form prevents recreating on re-render
- Global `staleTime: 60_000` — override per-query only when data changes faster or slower
- Global `retry: 1` — mutations default to 0 retries regardless

---

## 2. Query Keys — Conventions

All query keys are **inline arrays** in hooks. No centralized key factory.

| Pattern | Key shape | Invalidates |
|---------|-----------|-------------|
| Collection | `["items"]` | All item queries |
| Collection + filter | `["items", filter]` | Only that filter combo |
| Single resource | `["item", id]` | One item |
| Single resource + variant | `["item", id, variant]` | One item in one variant |
| Derived/computed | `["computed-view", idA, idB]` | Specific computed query |
| Sub-resource check | `["items", "slug-check", slug]` | Single availability check |

**Rules:**
- Every variable used inside `queryFn` must appear in the key
- Filter objects go directly in the key — TQ hashes them, property order doesn't matter
- Strip empty strings before passing to filter objects — use `|| undefined`
- For broad invalidation prefer `["items"]` prefix — it also invalidates `["items", filter]`, `["item", id]`, etc. via prefix matching

---

## 3. useQuery — Standard Pattern

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { itemService } from "./service";
import type { ItemListFilter } from "./schema";

// Collection query
export function useItems(filter: ItemListFilter = {}) {
  return useQuery({
    queryKey: ["items", filter],
    queryFn: () => itemService.getAll(filter),
    staleTime: 60_000,
  });
}

// Single resource
export function useItem(id: string) {
  return useQuery({
    queryKey: ["item", id],
    queryFn: () => itemService.getById(id),
    enabled: !!id,              // don't run until id is available
    staleTime: 60_000,
  });
}
```

**Key options:**

| Option | Type | Use |
|--------|------|-----|
| `staleTime` | `number` | Override global 60s (e.g. 300_000 for rarely-changing, 10_000 for live checks) |
| `enabled` | `boolean` | Guard against empty/falsy deps; defaults to `true` |
| `placeholderData` | `keepPreviousData \| (prev) => prev` | Prevent content flash on paginated queries |
| `select` | `(data) => T` | Transform/extract data before returning to component |
| `gcTime` | `number` | How long to cache when no subscribers (default 5min) |
| `refetchOnWindowFocus` | `boolean` | Default `true`; set `false` for heavy queries |

**Return values used in practice:**
- `data` — the resolved value or `undefined` while loading
- `isLoading` — `true` only on first load (no cached data)
- `isFetching` — `true` on any background refetch; use for subtle loading indicators
- `isError` / `error` — error state
- `isSuccess` — data is available

---

## 4. Conditional & Dependent Queries

```typescript
// Conditional — only runs when value is non-empty
export function useCheckSlug(slug: string) {
  return useQuery({
    queryKey: ["items", "slug-check", slug],
    queryFn: () => itemService.checkSlug(slug),
    enabled: slug.length >= 1,
    staleTime: 10_000,
  });
}

// Dependent — second query uses result of first
export function useItemWithOwner(id: string) {
  const { data: item } = useItem(id);
  return useQuery({
    queryKey: ["users", item?.ownerId],
    queryFn: () => userService.getById(item!.ownerId),
    enabled: !!item?.ownerId,
  });
}
```

---

## 5. Parallel Queries in queryFn

When a computed result needs data from multiple sources fetch them inside a single query:

```typescript
const { data: combined } = useQuery({
  queryKey: ["combined-view", typeAIds, typeBIds],
  queryFn: async () => {
    const [typeADetails, typeBDetails] = await Promise.all([
      Promise.all(typeAIds.map((id) => typeAService.getById(id))),
      Promise.all(typeBIds.map((id) => typeBService.getById(id))),
    ]);
    return { typeA: typeADetails, typeB: typeBDetails };
  },
  enabled: typeAIds.length > 0 || typeBIds.length > 0,
  staleTime: 300_000,
});
```

**Rule:** Prefer this over two separate `useQuery` calls when the component only needs the combined result.

---

## 6. useMutation — Standard Pattern

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemService } from "./service";
import type { CreateItemInput, UpdateItemInput } from "./schema";

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemInput) => itemService.create(data),
    onSuccess: () => {
      toast.success("Item created successfully");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create item");
    },
  });
}

export function useUpdateItem(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateItemInput) => itemService.update(id, data),
    onSuccess: () => {
      toast.success("Changes saved");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save changes");
    },
  });
}
```

**Rules:**
- `toast` lives inside `onSuccess/onError` — never in the component's submit handler
- `queryClient.invalidateQueries` lives inside `onSuccess` — never in the component
- Collection mutations (create/delete): invalidate `["items"]` (prefix match covers all)
- Single-resource mutations (update): invalidate both `["items"]` and `["item", id]`
- Scoped sub-resource updates: only invalidate `["item", id]` (no need to blow out the list)
- Error type annotation: `(error: Error)` — `httpClient` always throws `Error` with `.message`

### Inline callbacks — for navigation and form reset only

```typescript
// In component — inline callbacks are only for UI side-effects, never for toast/invalidation
createItem.mutate(data, {
  onSuccess: (result) => router.push(`/<feature>/${result.id}`),
});

// Form reset after inline add
addChild.mutate(data, {
  onSuccess: () => form.reset(),
});
```

### mutate vs mutateAsync

```typescript
// mutate — fire-and-forget; use in event handlers
createItem.mutate(data);

// mutateAsync — returns Promise; use when you need to await or compose
try {
  const result = await createItem.mutateAsync(data);
  // further logic that depends on result
} catch (error) {
  // onError in hook already handles toast; only catch here for extra logic
}
```

### Mutation state flags

| Flag | Meaning |
|------|---------|
| `isPending` | In flight — disable submit buttons |
| `isSuccess` | Last call succeeded |
| `isError` | Last call failed |
| `reset()` | Clears error/data back to idle |

---

## 7. Query Invalidation Strategy

```typescript
// Prefix invalidation — hits ["items"], ["items", filter], ["item", id], etc.
queryClient.invalidateQueries({ queryKey: ["items"] })

// Exact invalidation — only ["item", "abc123"]
queryClient.invalidateQueries({ queryKey: ["item", id], exact: true })

// Predicate — full control
queryClient.invalidateQueries({
  predicate: (query) => query.queryKey[0] === "items" && query.queryKey[1] !== "slug-check",
})
```

**Conventions:**
- Mutations that affect the collection → `invalidateQueries({ queryKey: ["items"] })`
- Mutations that affect one item → also `invalidateQueries({ queryKey: ["item", id] })`
- Mutations that affect only a sub-resource → `invalidateQueries({ queryKey: ["item", id] })` only

---

## 8. Filter + Pagination State (List Page Pattern)

```typescript
"use client";

const ALL_VALUE = "__all__";   // sentinel for Select "show all" option

export default function ItemsPage() {
  const router = useRouter();

  // --- filter state ---
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");   // immediate input value
  const [search, setSearch] = useState("");             // debounced value sent to query

  // debounce search + auto-reset page
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // pass clean filter to query — strip empties
  const { data, isLoading } = useItems({
    page,
    search: search || undefined,
    status: status || undefined,
    category: category || undefined,
  });

  // ...
}
```

**Rules:**
- Always keep two `useState` for debounced text inputs: `searchInput` (bound to `<Input>`) and `search` (sent to query key)
- Debounce delay: 300ms for search; no delay for selects
- Always call `setPage(1)` whenever any filter changes
- Pass `|| undefined` to strip empty strings — prevents stale query keys
- Select "show all" uses sentinel `"__all__"` value — shadcn Select requires a non-empty value

---

## 9. DataTable — Column Definitions

`DataTable` is a custom lightweight component at `src/components/shared/DataTable.tsx`. Always import the `Column` type alongside it.

```typescript
import { type Column, DataTable } from "@/components/shared";

const columns: Column<ListItem>[] = [
  // Basic column
  {
    key: "name",
    header: "Name",
    render: (item) => (
      <span className="font-medium">
        {item.name || <span className="text-muted-foreground">Untitled</span>}
      </span>
    ),
  },

  // Sortable column — provide sortValue when render returns JSX
  {
    key: "status",
    header: "Status",
    sortable: true,
    sortValue: (item) => item.status,         // plain string/number for comparison
    render: (item) => <StatusBadge state={item.status} />,
  },

  // Sortable with null-safe sortValue
  {
    key: "subtitle",
    header: "Subtitle",
    sortable: true,
    sortValue: (item) => item.subtitle ?? "",  // null → "" so it sorts last
    render: (item) => item.subtitle || <span className="text-muted-foreground">--</span>,
  },

  // Responsive — hidden on small screens
  {
    key: "category",
    header: "Category",
    className: "hidden lg:table-cell",
    render: (item) => item.category,
  },
];
```

**Column interface:**

```typescript
interface Column<T> {
  key: string;                                     // unique identifier
  header: string;                                  // header cell text
  render: (item: T) => React.ReactNode;            // cell content
  className?: string;                              // applied to both th and td
  sortable?: boolean;                              // enables client-side sort
  sortValue?: (item: T) => string | number | null; // comparable value; nulls sort last
}
```

**Sorting behavior:**
- Client-side only — sorts already-fetched data
- Click header → asc; click again → desc
- `sortValue` is required when `render` returns JSX (otherwise falls back to `item[key]` cast)
- `null` values always sort last regardless of direction

---

## 10. DataTable — Usage

```tsx
<DataTable
  columns={columns}
  data={data?.items ?? []}              // always provide fallback []
  keyExtractor={(item) => item.id}      // must be unique per row
  onRowClick={(item) => router.push(`/<feature>/${item.id}`)}
  emptyMessage="No items found."
  rowClassName={(item) =>               // optional conditional row styling
    item.status === "Archived" ? "opacity-50" : ""
  }
/>
```

**Props:**

| Prop | Type | Notes |
|------|------|-------|
| `columns` | `Column<T>[]` | Column definitions |
| `data` | `T[]` | Always pass `[]` when loading, not `undefined` |
| `keyExtractor` | `(item: T) => string` | Must be a stable unique key |
| `onRowClick` | `(item: T) => void` | Optional; adds `cursor-pointer` to rows |
| `rowClassName` | `(item: T) => string` | Optional conditional class per row |
| `emptyMessage` | `string` | Shown when `data.length === 0`; default "No results found." |

**Loading state:** render `isLoading` check before `<DataTable>`, not via a prop:

```tsx
{isLoading ? (
  <div className="flex h-32 items-center justify-center text-muted-foreground">
    Loading...
  </div>
) : (
  <DataTable columns={columns} data={data?.items ?? []} keyExtractor={(item) => item.id} />
)}
```

---

## 11. Pagination Component

```tsx
import { Pagination } from "@/components/shared";

{data && (
  <Pagination
    page={data.page}
    totalPages={data.totalPages}
    totalCount={data.totalCount}
    pageSize={data.pageSize}
    onPageChange={setPage}
  />
)}
```

**Props:**

| Prop | Type | Notes |
|------|------|-------|
| `page` | `number` | Current page (1-indexed) |
| `totalPages` | `number` | Total number of pages |
| `onPageChange` | `(page: number) => void` | Called on prev/next |
| `totalCount` | `number?` | Shows "Showing X–Y of Z" |
| `pageSize` | `number?` | Required alongside `totalCount` |

**Always conditionally render** — only render when `data` exists to avoid 0/0 edge cases.

---

## 12. Full List Page Skeleton

```tsx
"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { type Column, DataTable, Pagination } from "@/components/shared";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useItems } from "@/features/<feature>";
import type { ListItem } from "@/features/<feature>";
import { ItemStatus } from "@/types/enums";

const ALL_VALUE = "__all__";

export default function ItemsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useItems({
    page,
    search: search || undefined,
    status: status || undefined,
  });

  const columns: Column<ListItem>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (item) => item.name,
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => item.status,
    },
  ];

  return (
    <div className="@container space-y-6">
      <div className="flex flex-col @4xl:flex-row gap-4 justify-between">
        <PageHeader
          title="Items"
          badge={
            isLoading
              ? <Skeleton className="h-5 w-8 rounded" />
              : data
                ? <span className="text-xl font-normal text-muted-foreground">({data.totalCount})</span>
                : undefined
          }
        />
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={status || ALL_VALUE} onValueChange={(v) => { setStatus(v === ALL_VALUE ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All Statuses</SelectItem>
              {ItemStatus.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => router.push("/<feature>/create")}>
            <Plus className="h-4 w-4" /> Create
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">Loading...</div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.items ?? []}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => router.push(`/<feature>/${item.id}`)}
            emptyMessage="No items found."
          />
          {data && (
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              totalCount={data.totalCount}
              pageSize={data.pageSize}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
```

---

## 13. Optimistic Updates (When to Use)

All mutations in this project wait for server confirmation before invalidating — appropriate for an admin tool.

**Only add optimistic updates** if a mutation visually blocks the user (e.g. toggle switches). Use the UI-variable approach — simpler and no cache rollback risk:

```tsx
const { isPending, variables } = useToggleItem();

// Render optimistic state using mutation variables
const isEffectivelyActive = isPending
  ? variables?.active    // optimistic: what we sent
  : item.isActive;       // settled: server value
```

---

## 14. PaginatedResponse Type

All paginated service calls return this shape (from `src/types/common.ts`):

```typescript
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}
```

Service typing:
```typescript
async getAll(filter: ItemListFilter = {}): Promise<PaginatedResponse<ListItem>> {
  return httpClient.get("/<plural-name>", { ...filter });
}
```

---

## 15. Anti-Patterns

| Wrong | Right |
|-------|-------|
| `toast.success(...)` in component `onSubmit` | Inside `useMutation` `onSuccess` |
| `queryClient.invalidateQueries` in component | Inside `useMutation` `onSuccess` |
| `new QueryClient()` directly in component | `useState(() => new QueryClient(...))` in provider |
| Omitting deps from query key | All vars used in `queryFn` must be in key |
| `enabled: id !== null` when id is a string | `enabled: !!id` |
| `data?.items` without fallback in DataTable | `data?.items ?? []` |
| Render `<Pagination>` without checking `data` | Wrap in `{data && <Pagination ... />}` |
| `setPage(n)` without resetting on filter change | `setPage(1)` whenever any filter changes |
| Passing `""` in filter object to query | Pass `undefined` — strip empty strings with `|| undefined` |
| Invalidating with `exact: true` in mutation hooks | Prefix invalidation so all related queries update |
