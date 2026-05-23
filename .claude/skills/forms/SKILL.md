---
name: forms
description: Build forms using react-hook-form + Zod + FormField covering all field types, create/edit patterns, mutations, and advanced scenarios
argument-hint: "[form-name or scenario]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Forms

Build all forms using `react-hook-form` + `zodResolver` + the shared `FormField` component. No server actions — all mutations go through React Query hooks → service.

---

## Quick Reference

| Layer | Tool |
|-------|------|
| Schema | Zod (`src/features/<name>/schema.ts`) |
| State | `useForm` + `zodResolver` |
| Fields | `<FormField>` from `@/components/shared` |
| Mutations | `useMutation` hook from `src/features/<name>/hooks.ts` |
| Feedback | `toast.success/error` from `sonner` (inside hooks, NOT pages) |

---

## 1. Zod Schema Patterns

### Field type conventions

```typescript
// Text
name: z.string().min(1, "Required").max(255)

// Optional text
description: z.string().max(1000).nullable().optional()

// Number — use z.coerce only for API-facing schemas; use plain z.number() for form schemas
year: z.coerce.number().int().nullable().optional()

// Boolean (checkbox/switch) — always provide .default()
isActive: z.boolean().default(false)

// Enum select
status: z.enum(["Active", "Inactive", "Draft"])

// Optional enum
category: z.enum(["A", "B", "C"]).nullable().optional()

// URL
url: z.string().url("Invalid URL").max(2000)

// Email
email: z.string().min(1, "Required").email("Invalid email")

// Tags array
labels: z.array(z.string().max(50)).max(20).default([])
```

### Cross-field validation (`.refine`)

```typescript
export const changePasswordSchema = z.object({
  password: z.string().min(8, "At least 8 characters"),
  confirmPassword: z.string().min(1, "Required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],   // attaches error to the second field
});
```

### Type exports — always at bottom

```typescript
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
```

### Enums — use const-array pattern from `src/types/enums.ts`

```typescript
// enums.ts
export const ItemStatus = ["Active", "Draft", "Archived"] as const;
export type ItemStatus = (typeof ItemStatus)[number];
export const ItemStatusLabels: Record<ItemStatus, string> = {
  Active: "Active",
  Draft: "Draft",
  Archived: "Archived",
};

// schema.ts
status: z.enum(ItemStatus)
```

---

## 2. FormField — Complete Field Type Reference

Import: `import { FormField } from "@/components/shared";`

Always pass `control={form.control}` and a typed `name`. The component uses `Controller` internally — no manual `register()` needed.

### text / email / password / number

```tsx
<FormField control={form.control} name="title" type="text" label="Title"
  placeholder="Enter title" />

<FormField control={form.control} name="email" type="email" label="Email" />

<FormField control={form.control} name="password" type="password" label="Password" />

// Number: component converts "" → null internally; schema uses z.coerce.number()
<FormField control={form.control} name="year" type="number" label="Year"
  placeholder="e.g. 2024" />
```

### textarea

```tsx
<FormField control={form.control} name="description" type="textarea" label="Description"
  rows={4} placeholder="Write something..." />
```

### select

```tsx
<FormField
  control={form.control}
  name="status"
  type="select"
  label="Status"
  options={ItemStatus.map((v) => ({ value: v, label: ItemStatusLabels[v] }))}
/>
```

### checkbox

```tsx
// Schema: isActive: z.boolean().default(false)
// defaultValues: { isActive: false }
<FormField control={form.control} name="isActive" type="checkbox" label="Active" />
```

### switch

```tsx
// Same schema pattern as checkbox
<FormField control={form.control} name="isPublished" type="switch" label="Published" />
```

### tags

```tsx
// Schema: labels: z.array(z.string()).default([])
// defaultValues: { labels: [] }
// Accepts Enter / comma as delimiters; Backspace removes last tag
<FormField control={form.control} name="labels" type="tags" label="Labels"
  placeholder="Add tag and press Enter" />
```

### richText

```tsx
// Schema: body: z.string().nullable().optional()
// defaultValues: { body: "" }
// Uses Tiptap — handles paragraph indentation automatically
<FormField control={form.control} name="body" type="richText" label="Description" />
```

### Optional props (all types)

```tsx
description="Helper text shown below field"   // string
required={true}                                // adds asterisk
disabled={mutation.isPending}                 // disables input during submit
```

---

## 3. Create Form (Standard Pattern)

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { FormField } from "@/components/shared";
import { createItemSchema, type CreateItemInput, useCreateItem } from "@/features/<feature>";

export default function CreateItemPage() {
  const router = useRouter();
  const createItem = useCreateItem();

  const form = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      status: undefined,      // enum: undefined, never ""
      year: null,             // nullable number: null
      isActive: false,        // boolean: always provide explicit default
      labels: [],             // array: always provide []
    },
  });

  function onSubmit(data: CreateItemInput) {
    createItem.mutate(data, {
      onSuccess: (result) => router.push(`/<feature>/${result.id}`),
    });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Create Item" />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" type="text" label="Name" />
              <FormField control={form.control} name="status" type="select" label="Status"
                options={[{ value: "Active", label: "Active" }, { value: "Draft", label: "Draft" }]} />
              <div className="flex justify-end">
                <Button type="submit" disabled={createItem.isPending}>
                  {createItem.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Rules:**
- `defaultValues` must include ALL schema keys — missing keys create uncontrolled inputs
- Enum defaults: `undefined` (never `""`)
- Nullable numbers: `null`
- Booleans: explicit `false`
- Arrays: `[]`
- Toast + invalidation happen inside the hook — do not duplicate in `onSubmit`
- Post-create navigation: pass `onSuccess` callback to `mutate(data, { onSuccess })`

---

## 4. Edit Form (Pre-populated Pattern)

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared";
import { updateItemSchema, type UpdateItemInput, useUpdateItem } from "@/features/<feature>";
import type { ItemDetail } from "@/features/<feature>";

interface Props {
  item: ItemDetail;
}

export function ItemEditForm({ item }: Props) {
  const updateItem = useUpdateItem(item.id);

  const form = useForm<UpdateItemInput>({
    resolver: zodResolver(updateItemSchema),
    // Use `values` (not `defaultValues`) when data is loaded asynchronously —
    // it resets the form whenever the prop changes
    values: {
      name: item.name,
      status: item.status,
      year: item.year ?? null,
      isActive: item.isActive,
      labels: item.labels ?? [],
    },
  });

  function onSubmit(data: UpdateItemInput) {
    updateItem.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" type="text" label="Name" />
        <FormField control={form.control} name="status" type="select" label="Status"
          options={[{ value: "Active", label: "Active" }, { value: "Draft", label: "Draft" }]} />
        <div className="flex justify-end">
          <Button type="submit" disabled={updateItem.isPending}>
            {updateItem.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

**`defaultValues` vs `values`:**
- `defaultValues` — for new forms with static defaults (computed once on mount)
- `values` — for edit forms where data arrives from props/query; resets form when value changes

---

## 5. Multi-Section Form (Grouped Fields)

For long forms, group related fields in cards with section headings:

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

    {/* Section 1 */}
    <Card>
      <CardHeader>
        <CardTitle>Basic Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField control={form.control} name="name" type="text" label="Name" />
        <FormField control={form.control} name="status" type="select" label="Status" options={...} />
      </CardContent>
    </Card>

    {/* Section 2 */}
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField control={form.control} name="description" type="textarea" label="Description" rows={4} />
        <FormField control={form.control} name="labels" type="tags" label="Labels" />
      </CardContent>
    </Card>

    {/* Submit — sticky or inline */}
    <div className="flex justify-end">
      <Button type="submit" disabled={mutation.isPending}>Save</Button>
    </div>
  </form>
</Form>
```

---

## 6. Tab-Based Forms (Detail Page Pattern)

When a detail page has multiple form sections on tabs, each tab gets its own `useForm` instance:

```tsx
// ItemDetailPage.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ItemGeneralTab } from "./_components/ItemGeneralTab";
import { ItemLocalizationTab } from "./_components/ItemLocalizationTab";

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const { data: item } = useItemDetail(params.id);
  if (!item) return <ItemDetailSkeleton />;

  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="localization">Localization</TabsTrigger>
      </TabsList>
      <TabsContent value="general"><ItemGeneralTab item={item} /></TabsContent>
      <TabsContent value="localization"><ItemLocalizationTab item={item} /></TabsContent>
    </Tabs>
  );
}

// ItemGeneralTab.tsx — isolated form, uses `values` to sync with parent data
export function ItemGeneralTab({ item }: { item: ItemDetail }) {
  const updateItem = useUpdateItem(item.id);
  const form = useForm<UpdateItemInput>({
    resolver: zodResolver(updateItemSchema),
    values: { name: item.name, ... },
  });
  // ...
}
```

**Rule:** Never share a single `useForm` instance across tabs — each tab manages its own form state.

---

## 7. Dynamic Fields

### Conditional field visibility

```tsx
const category = form.watch("category");

{category === "TypeA" && (
  <FormField control={form.control} name="subType" type="select"
    label="Sub Type" options={...} />
)}
```

### Derived / auto-generated field (e.g. slug from name)

```tsx
const name = form.watch("name");

// Debounce slug generation
useEffect(() => {
  if (!name) return;
  const timer = setTimeout(() => {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    form.setValue("slug", slug, { shouldValidate: true });
  }, 500);
  return () => clearTimeout(timer);
}, [name, form]);
```

### Dependent async validation (e.g. slug availability)

```tsx
const slug = form.watch("slug");
const { data: slugCheck } = useCheckSlug(slug);   // enabled: slug.length >= 1

{slugCheck && (
  <p className={`text-sm ${slugCheck.available ? "text-success" : "text-destructive"}`}>
    {slugCheck.available ? "Slug is available" : "Slug is already taken"}
  </p>
)}
```

---

## 8. Location Picker Integration

For forms with coordinate/address fields:

```tsx
import { LocationPicker } from "@/components/shared";

// Schema fields
latitude: z.coerce.number().nullable().optional()
longitude: z.coerce.number().nullable().optional()
country: z.string().min(1).max(255)
region: z.string().nullable().optional()
city: z.string().nullable().optional()

// In form JSX
<LocationPicker
  latitude={form.watch("latitude")}
  longitude={form.watch("longitude")}
  onLocationSelect={(data) => {
    form.setValue("latitude", data.latitude, { shouldValidate: true });
    form.setValue("longitude", data.longitude, { shouldValidate: true });
    if (data.country) form.setValue("country", data.country);
    if (data.region) form.setValue("region", data.region);
    if (data.city) form.setValue("city", data.city);
  }}
/>
// Manual coordinate fields remain visible for precision edits
<div className="grid grid-cols-2 gap-4">
  <FormField control={form.control} name="latitude" type="number" label="Latitude" />
  <FormField control={form.control} name="longitude" type="number" label="Longitude" />
</div>
```

---

## 9. File / Media Upload

Media upload is handled by the shared `MediaUploader` component — do NOT build a custom file upload inside a form.

```tsx
import { MediaUploader } from "@/components/shared";

// Used outside the react-hook-form <form> tag — it manages its own upload state
<MediaUploader
  entityId={item.id}
  onUploadComplete={() => queryClient.invalidateQueries({ queryKey: ["item", item.id] })}
/>
```

**Upload flow (inside MediaUploader):**
1. `getUploadUrl(fileName, contentType)` → presigned S3 URL
2. `uploadToS3(url, file, onProgress)` via XHR for progress
3. `attachMedia(entityId, { s3Key, previewUrl, sourceUrl, isPrimary, mediaType })`

Never send files through `httpClient.postFormData` for media — always use the presigned S3 pattern.

---

## 10. Inline Add Form (List + Quick-Add)

For adding child items to a parent without navigating away:

```tsx
export function RelatedItemsSection({ parentId }: { parentId: string }) {
  const addItem = useAddRelatedItem(parentId);
  const form = useForm<AddRelatedItemInput>({
    resolver: zodResolver(addRelatedItemSchema),
    defaultValues: { url: "", type: undefined },
  });

  function onSubmit(data: AddRelatedItemInput) {
    addItem.mutate(data, {
      onSuccess: () => form.reset(),    // clear form after success
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-end">
          <div className="flex-1">
            <FormField control={form.control} name="url" type="text" label="URL" />
          </div>
          <div className="w-40">
            <FormField control={form.control} name="type" type="select" label="Type"
              options={[...]} />
          </div>
          <Button type="submit" disabled={addItem.isPending}>Add</Button>
        </form>
      </Form>
      {/* Existing list rendered below */}
    </div>
  );
}
```

---

## 11. Mutation Hook Pattern (inside `hooks.ts`)

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateItemInput, UpdateItemInput } from "./schema";
import { itemService } from "./service";

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
- `toast` calls live in hooks, never in page `onSubmit`
- `queryClient.invalidateQueries` lives in hooks
- Pass `onSuccess` / `onError` callbacks into `mutate(data, { onSuccess })` only for navigation or form reset — not for toast
- Error type: always `Error` (httpClient throws `Error` with `.message` set to API `detail`)

---

## 12. Loading Skeleton for Edit Forms

```tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ItemFormSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-9 w-24 ml-auto" />
      </CardContent>
    </Card>
  );
}

// Usage in page
if (!item) return <ItemFormSkeleton />;
```

---

## 13. Two-Column Layout for Related Fields

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  <FormField control={form.control} name="firstName" type="text" label="First Name" />
  <FormField control={form.control} name="lastName" type="text" label="Last Name" />
</div>
```

---

## 14. Confirm Before Destructive Action

For delete buttons on forms, always use `ConfirmDialog`:

```tsx
import { ConfirmDialog } from "@/components/shared";

<ConfirmDialog
  title="Delete Item"
  description="This action cannot be undone."
  onConfirm={() => deleteItem.mutate(item.id)}
  trigger={
    <Button variant="destructive" size="sm">Delete</Button>
  }
/>
```

---

## 15. Performance Checklist

- Use `form.watch("field")` only for fields that drive conditional rendering — watching unused fields causes needless re-renders
- For expensive conditional queries (slug check, availability), guard with `enabled: value.length >= 1`
- Pass `shouldValidate: true` to `form.setValue` only when you need immediate error feedback
- Use `values` (not `defaultValues`) for edit forms to avoid stale data after re-fetches
- Never call `form.reset()` on every render — only in `onSuccess` callbacks
- `useForm` is called once at page level; do not call it inside loops or conditionally

---

## Anti-Patterns to Avoid

| Wrong | Right |
|-------|-------|
| `defaultValues: { status: "" }` | `defaultValues: { status: undefined }` |
| `toast.success(...)` in `onSubmit` | Inside `useMutation` `onSuccess` |
| `queryClient.invalidate` in component | Inside `useMutation` `onSuccess` |
| `z.coerce.number()` in form schemas | `z.number()` in form schemas (coerce only for API-facing) |
| Missing keys in `defaultValues` | Include ALL schema keys |
| `defaultValues` for edit form with async data | `values` prop |
| Sharing one `useForm` across tabs | Separate `useForm` per tab |
| Calling `router.push` after login/logout | `window.location.href` (hard redirect) |
