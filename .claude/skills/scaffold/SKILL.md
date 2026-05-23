---
name: scaffold
description: Scaffold a new feature module (schema, types, service, hooks, index)
argument-hint: "[feature-name]"
allowed-tools: Read, Write, Bash, Glob, Grep
---

# Scaffold Feature Module

Create a new feature module at `src/features/<name>/` with all 5 files following project conventions.

No `actions.ts` — all mutations go through hooks → service (client-side React Query).

## Feature Structure

```
src/features/<name>/
├── schema.ts      # Zod schemas + z.infer type exports
├── types.ts       # Hand-written interfaces for API responses
├── service.ts     # Service object using httpClient
├── hooks.ts       # React Query hooks (queries + mutations with toast)
└── index.ts       # Barrel: export * from each file
```

## Step 1: schema.ts

```typescript
import { z } from "zod";

// Enum schemas (if applicable)
export const myItemCategorySchema = z.enum(["TypeA", "TypeB", "TypeC"]);

// Create schema
export const createMyItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  category: myItemCategorySchema.optional(),
  description: z.string().max(1000).optional(),
});

// Update schema
export const updateMyItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  category: myItemCategorySchema.optional(),
});

// Filter schema
export const myItemFilterSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

// Type exports at bottom
export type MyItemCategory = z.infer<typeof myItemCategorySchema>;
export type CreateMyItemInput = z.infer<typeof createMyItemSchema>;
export type UpdateMyItemInput = z.infer<typeof updateMyItemSchema>;
export type MyItemFilter = z.infer<typeof myItemFilterSchema>;
```

**Rules**:
- camelCase schema names
- `z.infer` type exports at bottom
- For forms: use `z.number().int().min(0)` (NOT `z.coerce.number()` or `.default()`) and set defaults via form `defaultValues`
- Select fields: use `z.enum([...]).optional()`, set `undefined` as default (never `""`)

## Step 2: types.ts

```typescript
import type { MyItemCategory } from "./schema";

export interface MyItemListItem {
  id: string;
  name: string;
  category?: MyItemCategory;
  createdAt: string;
  updatedAt: string;
}

export interface MyItemDetail extends MyItemListItem {
  description?: string;
}

export interface CreateMyItemResponse {
  id: string;
  message: string;
}
```

**Rules**:
- Hand-written interfaces (NOT `z.infer` — API types are separate from form schemas)
- Import schema enum types where needed
- Use `PaginatedResponse<T>` from `@/types/common` for list endpoints

## Step 3: service.ts

```typescript
import { httpClient } from "@/lib/http.client";
import type { PaginatedResponse } from "@/types/common";
import type { CreateMyItemInput, MyItemFilter, UpdateMyItemInput } from "./schema";
import type { CreateMyItemResponse, MyItemDetail, MyItemListItem } from "./types";

export const myItemService = {
  async getAll(filter: Partial<MyItemFilter> = {}): Promise<PaginatedResponse<MyItemListItem>> {
    return httpClient.get<PaginatedResponse<MyItemListItem>>("/my-items", {
      search: filter.search,
      page: filter.page ?? 1,
      pageSize: filter.pageSize ?? 20,
    });
  },

  async getById(id: string): Promise<MyItemDetail> {
    return httpClient.get<MyItemDetail>(`/my-items/${id}`);
  },

  async create(input: CreateMyItemInput): Promise<CreateMyItemResponse> {
    return httpClient.post<CreateMyItemResponse>("/my-items", input);
  },

  async update(id: string, input: Partial<UpdateMyItemInput>): Promise<void> {
    return httpClient.put<void>(`/my-items/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`/my-items/${id}`);
  },
};
```

**Rules**:
- Export a service **object** (not standalone functions)
- Use `httpClient` from `@/lib/http.client`
- Paths start with `/resource` — the client auto-prepends `/api/admin/v1`
- Pass filter fields explicitly — the client filters out `undefined/null/""`
- NO business logic — pure API calls
- Full service patterns: `.claude/skills/http/SKILL.md`

## Step 4: hooks.ts

```typescript
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { MyItemFilter } from "./schema";
import { myItemService } from "./service";

export function useMyItems(filter?: Partial<MyItemFilter>) {
  return useQuery({
    queryKey: ["my-items", filter],
    queryFn: () => myItemService.getAll(filter),
  });
}

export function useMyItemDetail(id: string) {
  return useQuery({
    queryKey: ["my-item", id],
    queryFn: () => myItemService.getById(id),
    enabled: !!id,
  });
}

export function useMyItem() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: myItemService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-items"] });
      toast.success("Item created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: myItemService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-items"] });
      toast.success("Item deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete item");
    },
  });

  return {
    create: createMutation,
    delete: deleteMutation,
  };
}
```

**Rules**:
- `"use client"` directive
- Inline query keys (`["my-items", filter]`) — NO centralized factory
- Toast via `sonner` on mutation success/error
- Invalidate queries inside hooks (NOT in components)
- For full query/mutation/table patterns see `.claude/skills/tanstack/SKILL.md`

## Step 5: index.ts

```typescript
export * from "./schema";
export * from "./types";
export * from "./service";
export * from "./hooks";
```

## Form Template

For all form patterns (create, edit, multi-section, tab-based, dynamic fields, location picker, file upload, inline add) — see `.claude/skills/forms/SKILL.md`.

**Schema rules that apply here:**
- `z.number().int().min(0)` in form schemas (NOT `z.coerce`)
- Select defaults: `undefined` (never `""`)
- `defaultValues` must include ALL schema keys

## Post-Scaffold Checklist

1. All 5 files created
2. Run `npx biome check --write src/features/<name>/`
3. Run `npm run build` (type check)
4. Add navigation entry in `src/config/navigation.ts` if needed
5. If the new feature introduces a pattern not yet covered in `.claude/skills/`, update the relevant skill(s)
