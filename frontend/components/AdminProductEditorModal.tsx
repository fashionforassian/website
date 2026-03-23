"use client";

import { useEffect, useState } from "react";
import AdminStructuredFields from "@/components/AdminStructuredFields";
import { type EditableColorVariant, type ProductFormState } from "@/lib/admin-product-form";
import { type Category, type ProductStatus } from "@/lib/data";

type Props = {
  isOpen: boolean;
  selectedId: string | null;
  form: ProductFormState;
  message: string;
  saving: boolean;
  uploading: boolean;
  categoryOptions: Category[];
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
  handleCoverUpload: (files: FileList | null, cropFocus?: "center" | "north" | "south" | "east" | "west") => Promise<void>;
  handleGalleryAppend: (files: FileList | null) => Promise<void>;
  handleGalleryReplace: (index: number, files: FileList | null) => Promise<void>;
  removeGalleryImage: (index: number) => void;
  makeCoverImage: (index: number) => void;
  reorderGalleryImages: (fromIndex: number, toIndex: number) => void;
  handleColorImageUpload: (colorId: string, files: FileList | null, cropFocus?: "center" | "north" | "south" | "east" | "west") => Promise<void>;
  handleColorGalleryAppend: (colorId: string, files: FileList | null) => Promise<void>;
  handleColorGalleryReplace: (colorId: string, index: number, files: FileList | null) => Promise<void>;
  removeColorGalleryImage: (colorId: string, index: number) => void;
  reorderColorGalleryImages: (colorId: string, fromIndex: number, toIndex: number) => void;
};

export default function AdminProductEditorModal({
  isOpen,
  selectedId,
  form,
  message,
  saving,
  uploading,
  categoryOptions,
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
  handleCoverUpload,
  handleGalleryAppend,
  handleGalleryReplace,
  removeGalleryImage,
  makeCoverImage,
  reorderGalleryImages,
  handleColorImageUpload,
  handleColorGalleryAppend,
  handleColorGalleryReplace,
  removeColorGalleryImage,
  reorderColorGalleryImages,
}: Props) {
  const [coverCropFocus, setCoverCropFocus] = useState<"center" | "north" | "south" | "east" | "west">("center");

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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/70 px-4 py-8"
      onWheelCapture={(event) => event.stopPropagation()}
      onTouchMoveCapture={(event) => event.stopPropagation()}
    >
      <div className="mx-auto flex h-full w-full max-w-6xl items-start justify-center">
        <div className="flex max-h-full w-full flex-col overflow-hidden border border-neutral-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Product Editor</p>
            <h2 className="mt-2 font-heading text-3xl text-[#111111]">
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
          className="flex-1 overflow-y-auto overscroll-contain px-6 py-6"
        >
          <div className="space-y-8">
          {message ? <p className="text-sm text-[#222222]">{message}</p> : null}

          <div className="grid gap-8 xl:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
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
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Popularity</span>
                  <input type="number" min="1" max="100" value={form.popularity} onChange={(e) => updateForm("popularity", e.target.value)} className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]" />
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

              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Description</span>
                  <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} rows={6} className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#111111]" />
                </label>
                <label className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Fabric & Care</span>
                  <textarea value={form.fabricCare} onChange={(e) => updateForm("fabricCare", e.target.value)} rows={6} className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#111111]" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex items-center gap-3 border border-neutral-200 p-4">
                  <input type="checkbox" checked={form.isNew} onChange={(e) => updateForm("isNew", e.target.checked)} />
                  <span className="text-sm text-[#222222]">Mark as new</span>
                </label>
                <label className="flex items-center gap-3 border border-neutral-200 p-4">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateForm("isFeatured", e.target.checked)} />
                  <span className="text-sm text-[#222222]">Feature on storefront</span>
                </label>
                <label className="flex items-center gap-3 border border-neutral-200 p-4">
                  <input type="checkbox" checked={form.isSale} onChange={(e) => updateForm("isSale", e.target.checked)} />
                  <span className="text-sm text-[#222222]">Treat as sale item</span>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <AdminStructuredFields
                colorVariants={form.colorVariants}
                sizes={form.sizes}
                tags={form.tags}
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
              />

              <div className="border border-neutral-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Fallback Cover Image</p>
                    <p className="mt-1 text-sm text-[#222222]">Used when a color-specific cover is not set.</p>
                  </div>
                  <label className="cursor-pointer border border-[#111111] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#111111] hover:bg-[#111111] hover:text-white">
                    {uploading ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => void handleCoverUpload(e.target.files, coverCropFocus)} />
                  </label>
                </div>
                <select
                  value={coverCropFocus}
                  onChange={(event) => setCoverCropFocus(event.target.value as "center" | "north" | "south" | "east" | "west")}
                  className="mt-3 h-10 w-full border border-neutral-300 px-3 text-[11px] uppercase tracking-[0.16em] text-[#111111] outline-none focus:border-[#111111]"
                >
                  <option value="center">Cover Crop: Center</option>
                  <option value="north">Cover Crop: Top</option>
                  <option value="south">Cover Crop: Bottom</option>
                  <option value="east">Cover Crop: Right</option>
                  <option value="west">Cover Crop: Left</option>
                </select>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                  Cover uploads are auto-cropped to 4:5, resized, and compressed.
                </p>
                <div className="mt-4 overflow-hidden border border-neutral-200">
                  {form.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.image}
                      alt={form.name || "Cover preview"}
                      className="aspect-[4/5] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/5] items-center justify-center text-sm text-neutral-500">
                      No cover image yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-neutral-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">General Gallery</p>
                    <p className="mt-1 text-sm text-[#222222]">Shared fallback images for every color variant.</p>
                  </div>
                  <label className="cursor-pointer border border-neutral-300 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]">
                    {uploading ? "Uploading..." : "Add Images"}
                    <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={(e) => void handleGalleryAppend(e.target.files)} />
                  </label>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {form.images.length === 0 ? (
                    <div className="col-span-full flex h-40 items-center justify-center border border-dashed border-neutral-300 text-sm text-neutral-500">
                      No gallery images yet.
                    </div>
                  ) : (
                    form.images.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="border border-neutral-200 p-3"
                        draggable
                        onDragStart={(event) => event.dataTransfer.setData("text/gallery-index", String(index))}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          const fromIndex = Number(event.dataTransfer.getData("text/gallery-index"));
                          if (!Number.isNaN(fromIndex)) {
                            reorderGalleryImages(fromIndex, index);
                          }
                        }}
                      >
                        <div className="overflow-hidden border border-neutral-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="aspect-[4/5] w-full object-cover"
                          />
                        </div>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                          Drag to reorder
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <label className="cursor-pointer border border-neutral-300 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]">
                            Replace
                            <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => void handleGalleryReplace(index, e.target.files)} />
                          </label>
                          {index !== 0 ? (
                            <button type="button" onClick={() => makeCoverImage(index)} className="border border-neutral-300 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]">
                              Make Cover
                            </button>
                          ) : null}
                          <button type="button" onClick={() => removeGalleryImage(index)} className="border border-red-300 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-red-600 hover:border-red-600">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-6">
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
