"use client";

import { useEffect } from "react";
import AdminStructuredFields from "@/components/AdminStructuredFields";
import { type EditableColorVariant, type EditableVariantStock, type ProductFormState } from "@/lib/admin-product-form";
import { type Category, type ProductStatus } from "@/lib/data";

type Props = {
  isOpen: boolean;
  selectedId: string | null;
  form: ProductFormState;
  message: string;
  messageTone: "neutral" | "success" | "error";
  saving: boolean;
  uploading: boolean;
  categoryOptions: Category[];
  categoryPathOptions: Array<{ key: string; slugs: string[]; label: string }>;
  colorVariants: EditableColorVariant[];
  variantStocks: EditableVariantStock[];
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  updateForm: <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => void;
  addSize: (value: string) => void;
  removeSize: (value: string) => void;
  addTag: (value: string) => void;
  removeTag: (value: string) => void;
  addColorVariant: (value: string) => void;
  removeColorVariant: (id: string) => void;
  updateColorVariant: (id: string, patch: Partial<EditableColorVariant>) => void;
  makeDefaultColorVariant: (id: string) => void;
  handleColorImageUpload: (colorId: string, files: FileList | null) => Promise<void>;
  handleColorGalleryAppend: (colorId: string, files: FileList | null) => Promise<void>;
  handleColorGalleryReplace: (colorId: string, index: number, files: FileList | null) => Promise<void>;
  removeColorGalleryImage: (colorId: string, index: number) => void;
  reorderColorGalleryImages: (colorId: string, fromIndex: number, toIndex: number) => void;
  updateVariantStock: (color: string, size: string, patch: { inventory?: string; price?: string }) => void;
};

export default function AdminProductEditorModal({
  isOpen,
  selectedId,
  form,
  message,
  messageTone,
  saving,
  uploading,
  categoryOptions,
  categoryPathOptions,
  colorVariants,
  variantStocks,
  onClose,
  onSubmit,
  updateForm,
  addSize,
  removeSize,
  addTag,
  removeTag,
  addColorVariant,
  removeColorVariant,
  updateColorVariant,
  makeDefaultColorVariant,
  handleColorImageUpload,
  handleColorGalleryAppend,
  handleColorGalleryReplace,
  removeColorGalleryImage,
  reorderColorGalleryImages,
  updateVariantStock,
}: Props) {
  const selectedPathKey = form.categoryPathSlugs.length ? form.categoryPathSlugs.join("/") : "";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-80 overflow-y-auto bg-black/70 px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8"
      onClick={onClose}
      onWheelCapture={(event) => event.stopPropagation()}
      onTouchMoveCapture={(event) => event.stopPropagation()}
    >
      <div className="mx-auto flex min-h-full w-full max-w-6xl items-start justify-center">
        <div
          className="flex max-h-[min(92vh,1100px)] w-full flex-col overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Product Editor</p>
            <h2 className="mt-2 font-heading text-2xl text-[#111111] sm:text-3xl">
              {selectedId ? "Edit Product" : "Create Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-neutral-300 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
          >
            Close
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          onWheelCapture={(event) => event.stopPropagation()}
          onTouchMoveCapture={(event) => event.stopPropagation()}
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6"
        >
          <div className="space-y-5">
          {message ? (
            <p
              aria-live="polite"
              className={`rounded-xl border px-4 py-3 text-sm ${
                messageTone === "error"
                  ? "border-red-300 bg-red-50 text-red-700"
                  : messageTone === "success"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-neutral-200 bg-white text-[#222222]"
              }`}
            >
              {message}
            </p>
          ) : null}

          <div className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr] xl:gap-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Product Name</span>
                  <input value={form.name} onChange={(e) => updateForm("name", e.target.value)} className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]" required />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Category</span>
                  <select value={form.category} onChange={(e) => updateForm("category", e.target.value as Category)} className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]">
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Subcategory Path</span>
                  <select
                    value={selectedPathKey}
                    onChange={(event) => {
                      const nextKey = event.target.value;
                      if (!nextKey) {
                        updateForm("categoryPathSlugs", []);
                        return;
                      }
                      const found = categoryPathOptions.find((option) => option.key === nextKey);
                      if (found) {
                        updateForm("category", found.slugs[0] as Category);
                        updateForm("categoryPathSlugs", found.slugs);
                      }
                    }}
                    className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]"
                  >
                    <option value="">No subcategory path (main category only)</option>
                    {categoryPathOptions
                      .filter((option) => option.slugs[0] === form.category)
                      .map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Slug</span>
                  <input value={form.slug} onChange={(e) => updateForm("slug", e.target.value)} className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">SKU</span>
                  <input value={form.sku} onChange={(e) => updateForm("sku", e.target.value)} className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Price</span>
                  <input type="number" min="1" step="0.01" value={form.price} onChange={(e) => updateForm("price", e.target.value)} className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]" required />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Compare At Price</span>
                  <input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={(e) => updateForm("compareAtPrice", e.target.value)} className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Inventory</span>
                  <input type="number" min="0" value={form.inventory} onChange={(e) => updateForm("inventory", e.target.value)} className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]" required />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Status</span>
                  <select value={form.status} onChange={(e) => updateForm("status", e.target.value as ProductStatus)} className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Description</span>
                  <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} rows={6} className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#111111]" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Fabric & Care</span>
                  <textarea value={form.fabricCare} onChange={(e) => updateForm("fabricCare", e.target.value)} rows={6} className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#111111]" />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-3">
                  <input type="checkbox" checked={form.isNew} onChange={(e) => updateForm("isNew", e.target.checked)} />
                  <span className="text-sm text-[#222222]">Mark as new</span>
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-3">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateForm("isFeatured", e.target.checked)} />
                  <span className="text-sm text-[#222222]">Feature on storefront</span>
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-3">
                  <input type="checkbox" checked={form.isSale} onChange={(e) => updateForm("isSale", e.target.checked)} />
                  <span className="text-sm text-[#222222]">Treat as sale item</span>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <AdminStructuredFields
                sizes={form.sizes}
                tags={form.tags}
                colorVariants={colorVariants}
                variantStocks={variantStocks}
                uploading={uploading}
                addSize={addSize}
                removeSize={removeSize}
                addTag={addTag}
                removeTag={removeTag}
                addColorVariant={addColorVariant}
                removeColorVariant={removeColorVariant}
                updateColorVariant={updateColorVariant}
                makeDefaultColorVariant={makeDefaultColorVariant}
                handleColorImageUpload={handleColorImageUpload}
                handleColorGalleryAppend={handleColorGalleryAppend}
                handleColorGalleryReplace={handleColorGalleryReplace}
                removeColorGalleryImage={removeColorGalleryImage}
                reorderColorGalleryImages={reorderColorGalleryImages}
                updateVariantStock={updateVariantStock}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:flex-wrap">
            <button type="submit" disabled={saving || uploading} className="border border-[#111111] bg-[#111111] px-6 py-3 text-xs uppercase tracking-[0.18em] text-white hover:bg-white hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Saving..." : selectedId ? "Update Product" : "Create Product"}
            </button>
            <button type="button" onClick={onClose} className="border border-neutral-300 px-6 py-3 text-xs uppercase tracking-[0.18em] text-[#111111] hover:border-[#111111]">
              Cancel
            </button>
          </div>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
