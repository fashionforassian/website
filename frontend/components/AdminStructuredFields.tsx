"use client";

import { useMemo, useState } from "react";
import { LETTER_SIZE_PRESETS, NUMBER_SIZE_PRESETS, SPECIAL_SIZE_PRESETS } from "@/lib/product-options";
import { type EditableColorVariant, type EditableVariantStock } from "@/lib/admin-product-form";

type Props = {
  sizes: string[];
  tags: string[];
  colorVariants: EditableColorVariant[];
  variantStocks: EditableVariantStock[];
  uploading: boolean;
  addSize: (value: string) => void;
  removeSize: (value: string) => void;
  addTag: (value: string) => void;
  removeTag: (value: string) => void;
  addColorVariant: (value: string, swatch?: string) => void;
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

export default function AdminStructuredFields({
  sizes,
  tags,
  colorVariants,
  variantStocks,
  uploading,
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
  const [sizeSystem, setSizeSystem] = useState<"letter" | "number" | "special">(() => {
    if (sizes.some((size) => LETTER_SIZE_PRESETS.includes(size as (typeof LETTER_SIZE_PRESETS)[number]))) {
      return "letter";
    }

    if (sizes.some((size) => NUMBER_SIZE_PRESETS.includes(size as (typeof NUMBER_SIZE_PRESETS)[number]))) {
      return "number";
    }

    if (sizes.some((size) => SPECIAL_SIZE_PRESETS.includes(size as (typeof SPECIAL_SIZE_PRESETS)[number]))) {
      return "special";
    }

    return "letter";
  });
  const [customSize, setCustomSize] = useState("");
  const [customColorName, setCustomColorName] = useState("");
  const [customColorValue, setCustomColorValue] = useState("#111111");
  const [colorEntryMode, setColorEntryMode] = useState<"wheel" | "hex">("wheel");
  const [tagInput, setTagInput] = useState("");

  const selectedSizeSet = useMemo(() => new Set(sizes), [sizes]);
  const sizePresetOptions =
    sizeSystem === "number"
      ? NUMBER_SIZE_PRESETS
      : sizeSystem === "special"
        ? SPECIAL_SIZE_PRESETS
        : LETTER_SIZE_PRESETS;
  const stockMap = useMemo(
    () => new Map(variantStocks.map((stock) => [`${stock.color.toLowerCase()}::${stock.size.toLowerCase()}`, stock])),
    [variantStocks],
  );

  function togglePresetSize(size: string) {
    if (selectedSizeSet.has(size)) {
      removeSize(size);
      return;
    }

    addSize(size);
  }

  function submitCustomSize() {
    const normalized = customSize.trim();
    if (!normalized) return;
    addSize(normalized);
    setCustomSize("");
  }

  function submitCustomColor() {
    const normalizedName = customColorName.trim();
    const normalizedSwatch = normalizeHexColor(customColorValue);
    if (!normalizedName || !normalizedSwatch) return;
    addColorVariant(normalizedName, normalizedSwatch);
    setCustomColorName("");
    setCustomColorValue("#111111");
  }

  function submitTag() {
    const normalized = tagInput.trim();
    if (!normalized) return;
    addTag(normalized);
    setTagInput("");
  }

  const hasMatrix = colorVariants.length > 0 && sizes.length > 0;

  function normalizeHexColor(value: string) {
    const trimmed = value.trim().replace(/^#/, "");
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(trimmed)) {
      return "";
    }

    return `#${trimmed.toUpperCase()}`;
  }

  function handleColorValueChange(value: string) {
    if (colorEntryMode === "wheel") {
      setCustomColorValue(value);
      return;
    }

    const normalized = value.startsWith("#") ? value : `#${value}`;
    setCustomColorValue(normalizeHexColor(normalized) || normalized.toUpperCase());
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Sizes</p>
            <p className="mt-1 text-sm text-[#222222]">Choose letter sizes, numeric sizes, or a special size like One Size.</p>
          </div>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            {sizes.length} selected
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSizeSystem("letter")}
            className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition ${
              sizeSystem === "letter"
                ? "border-[#111111] bg-[#111111] text-white"
                : "border-neutral-300 bg-white text-[#111111] hover:border-[#111111]"
            }`}
          >
            Letter Sizes
          </button>
          <button
            type="button"
            onClick={() => setSizeSystem("number")}
            className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition ${
              sizeSystem === "number"
                ? "border-[#111111] bg-[#111111] text-white"
                : "border-neutral-300 bg-white text-[#111111] hover:border-[#111111]"
            }`}
          >
            Numeric Sizes
          </button>
          <button
            type="button"
            onClick={() => setSizeSystem("special")}
            className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition ${
              sizeSystem === "special"
                ? "border-[#111111] bg-[#111111] text-white"
                : "border-neutral-300 bg-white text-[#111111] hover:border-[#111111]"
            }`}
          >
            Special Sizes
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {sizePresetOptions.map((size) => {
            const isSelected = selectedSizeSet.has(size);

            return (
              <button
                key={size}
                type="button"
                onClick={() => togglePresetSize(size)}
                className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.14em] transition ${
                  isSelected
                    ? "border-[#111111] bg-[#111111] text-white shadow-sm"
                    : "border-neutral-300 bg-white text-[#111111] hover:border-[#111111]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-neutral-300 bg-white px-3 py-2">
          <input
            value={customSize}
            onChange={(event) => setCustomSize(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitCustomSize();
              }
            }}
            placeholder={`Add a custom ${sizeSystem === "number" ? "number" : sizeSystem === "special" ? "special" : "letter"} size and press Enter`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>

        {sizes.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => removeSize(size)}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#111111] hover:border-[#111111]"
              >
                {size}
                <span className="text-neutral-400">x</span>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Colors</p>
            <p className="mt-1 text-sm text-[#222222]">Add the colors you want to sell and keep the matrix aligned below.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setColorEntryMode("wheel")}
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition ${
                colorEntryMode === "wheel"
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-neutral-300 bg-white text-[#111111] hover:border-[#111111]"
              }`}
            >
              Color Wheel
            </button>
            <button
              type="button"
              onClick={() => setColorEntryMode("hex")}
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition ${
                colorEntryMode === "hex"
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-neutral-300 bg-white text-[#111111] hover:border-[#111111]"
              }`}
            >
              Hex Code
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr,auto]">
            <input
              value={customColorName}
              onChange={(event) => setCustomColorName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submitCustomColor();
                }
              }}
              placeholder="Color name, like Coral or Sage"
              className="h-11 rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#111111]"
            />
            <button
              type="button"
              onClick={submitCustomColor}
              className="h-11 rounded-xl border border-[#111111] px-4 text-[11px] uppercase tracking-[0.16em] text-[#111111] hover:bg-[#111111] hover:text-white"
            >
              Add Color
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-[auto,1fr]">
            <input
              type="color"
              value={customColorValue}
              onChange={(event) => handleColorValueChange(event.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-neutral-300 bg-white p-1"
            />
            {colorEntryMode === "wheel" ? (
              <input
                value={customColorValue}
                onChange={(event) => handleColorValueChange(event.target.value)}
                onBlur={(event) => {
                  const normalized = normalizeHexColor(event.target.value);
                  if (normalized) {
                    setCustomColorValue(normalized);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    submitCustomColor();
                  }
                }}
                placeholder="#D8A7B1"
                className="h-11 rounded-xl border border-neutral-300 bg-white px-3 text-sm uppercase tracking-[0.14em] outline-none placeholder:text-neutral-400 focus:border-[#111111]"
              />
            ) : (
              <input
                value={customColorValue}
                onChange={(event) => handleColorValueChange(event.target.value)}
                onBlur={(event) => {
                  const normalized = normalizeHexColor(event.target.value);
                  if (normalized) {
                    setCustomColorValue(normalized);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    submitCustomColor();
                  }
                }}
                placeholder="#D8A7B1"
                className="h-11 rounded-xl border border-neutral-300 bg-white px-3 text-sm uppercase tracking-[0.14em] outline-none placeholder:text-neutral-400 focus:border-[#111111]"
              />
            )}
          </div>

          {colorVariants.length > 0 ? (
            <div className="space-y-3">
              {colorVariants.map((variant, index) => (
                <article
                  key={variant.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: variant.swatch }} />
                      <input
                        value={variant.name}
                        onChange={(event) => updateColorVariant(variant.id, { name: event.target.value })}
                        className="min-w-24 border-b border-neutral-300 bg-transparent px-1 py-1 text-sm outline-none focus:border-[#111111]"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {index !== 0 ? (
                        <button
                          type="button"
                          onClick={() => makeDefaultColorVariant(variant.id)}
                          className="rounded-full border border-neutral-300 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-neutral-600 hover:border-[#111111] hover:text-[#111111]"
                        >
                          Default
                        </button>
                      ) : null}
                      {colorVariants.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeColorVariant(variant.id)}
                          className="rounded-full border border-red-200 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-red-600 hover:border-red-400"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Color Images</p>
            <p className="mt-1 text-sm text-[#222222]">Add images per color after the stock matrix. Keep this section tight and use it only for the gallery.</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {colorVariants.length > 0 ? (
            colorVariants.map((variant) => (
              <article key={variant.id} className="rounded-2xl border border-neutral-200 bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: variant.swatch }} />
                    <p className="text-sm text-[#111111]">{variant.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="cursor-pointer rounded-full border border-[#111111] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:bg-[#111111] hover:text-white">
                      {uploading ? "Uploading..." : "Set Cover"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={(event) => void handleColorImageUpload(variant.id, event.target.files)}
                      />
                    </label>
                    <label className="cursor-pointer rounded-full border border-neutral-300 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]">
                      {uploading ? "Uploading..." : "Add Images"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={uploading}
                        onChange={(event) => void handleColorGalleryAppend(variant.id, event.target.files)}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {variant.images.length > 0 ? (
                    variant.images.map((image, imageIndex) => (
                      <div key={`${variant.id}-${imageIndex}`} className="rounded-xl border border-neutral-200 p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt={`${variant.name} ${imageIndex + 1}`} className="aspect-4/5 w-full rounded-lg object-cover" />
                        <div className="mt-2 flex flex-wrap gap-2">
                          <label className="cursor-pointer rounded-full border border-neutral-300 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading}
                              onChange={(event) => void handleColorGalleryReplace(variant.id, imageIndex, event.target.files)}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeColorGalleryImage(variant.id, imageIndex)}
                            className="rounded-full border border-red-200 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-red-600 hover:border-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center text-sm text-neutral-500">
                      No images yet for this color.
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-5 text-sm text-neutral-500">
              Add a color first, then attach images here.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Stock Matrix</p>
            <p className="mt-1 text-sm text-[#222222]">Set inventory and price for each color and size. Leave unavailable combinations at 0.</p>
          </div>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            {variantStocks.reduce((total, stock) => total + Number(stock.inventory || 0), 0)} total
          </span>
        </div>

        {!hasMatrix ? (
          <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-5 text-sm text-neutral-500">
            Add at least one color and one size to manage stock combinations.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <div className="rounded-2xl border border-neutral-200 bg-white p-3" style={{ minWidth: "720px" }}>
              <div className="grid gap-2" style={{ gridTemplateColumns: `180px repeat(${sizes.length}, minmax(96px, 1fr))` }}>
                <div className="px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500">Color / Size</div>
                {sizes.map((size) => (
                  <div key={size} className="px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                    {size}
                  </div>
                ))}

                {colorVariants.map((variant) => (
                  <div key={variant.id} className="contents">
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2">
                      <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: variant.swatch }} />
                      <span className="text-sm text-[#111111]">{variant.name}</span>
                    </div>
                    {sizes.map((size) => {
                      const key = `${variant.name.toLowerCase()}::${size.toLowerCase()}`;
                      const current = stockMap.get(key);

                      return (
                        <div
                          key={`${variant.id}-${size}`}
                          className={`rounded-xl border px-2 py-2 ${Number(current?.inventory || 0) > 0 ? "border-neutral-200 bg-white" : "border-dashed border-neutral-300 bg-neutral-50"}`}
                        >
                          <div className="space-y-2">
                            <div>
                              <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-neutral-500">Inventory</p>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={current?.inventory ?? "0"}
                                onChange={(event) =>
                                  updateVariantStock(variant.name, size, {
                                    inventory: event.target.value,
                                  })
                                }
                                className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-[#111111]"
                              />
                            </div>
                            <div>
                              <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-neutral-500">Price</p>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={current?.price ?? ""}
                                onChange={(event) =>
                                  updateVariantStock(variant.name, size, {
                                    price: event.target.value,
                                  })
                                }
                                placeholder="Base price"
                                className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#111111]"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Tags</p>
            <p className="mt-1 text-sm text-[#222222]">Search keywords and admin labels.</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-neutral-300 bg-white px-3 py-2">
          <input
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitTag();
              }
            }}
            placeholder="Add tag and press Enter"
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#111111] hover:border-[#111111]"
              >
                {tag}
                <span className="text-neutral-400">x</span>
              </button>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
