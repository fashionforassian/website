"use client";

import { useMemo, useState } from "react";
import { type EditableColorVariant } from "@/lib/admin-product-form";
import { COLOR_PRESETS, SIZE_PRESETS } from "@/lib/product-options";

type Props = {
  colorVariants: EditableColorVariant[];
  sizes: string[];
  tags: string[];
  uploading: boolean;
  addSize: (value: string) => void;
  removeSize: (value: string) => void;
  addTag: (value: string) => void;
  removeTag: (value: string) => void;
  addColorVariant: (value: string) => void;
  removeColorVariant: (id: string) => void;
  updateColorVariant: (id: string, patch: Partial<EditableColorVariant>) => void;
  makeDefaultColorVariant: (id: string) => void;
  handleColorImageUpload: (
    colorId: string,
    files: FileList | null,
    cropFocus?: "center" | "north" | "south" | "east" | "west",
  ) => Promise<void>;
  handleColorGalleryAppend: (colorId: string, files: FileList | null) => Promise<void>;
  handleColorGalleryReplace: (colorId: string, index: number, files: FileList | null) => Promise<void>;
  removeColorGalleryImage: (colorId: string, index: number) => void;
  reorderColorGalleryImages: (colorId: string, fromIndex: number, toIndex: number) => void;
};

const CUSTOM_COLOR_VALUE = "__custom__";

export default function AdminStructuredFields({
  colorVariants,
  sizes,
  tags,
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
}: Props) {
  const [colorPickerValue, setColorPickerValue] = useState<string>(COLOR_PRESETS[0]?.name ?? "Black");
  const [showCustomColorInput, setShowCustomColorInput] = useState(false);
  const [customColor, setCustomColor] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [cropFocusByColor, setCropFocusByColor] = useState<Record<string, "center" | "north" | "south" | "east" | "west">>({});

  const selectedSizeSet = useMemo(() => new Set(sizes), [sizes]);

  function togglePresetSize(size: string) {
    if (selectedSizeSet.has(size)) {
      removeSize(size);
      return;
    }

    addSize(size);
  }

  function handleColorSelect(value: string) {
    if (value === CUSTOM_COLOR_VALUE) {
      setShowCustomColorInput(true);
      setColorPickerValue(CUSTOM_COLOR_VALUE);
      return;
    }

    setShowCustomColorInput(false);
    setColorPickerValue(value);
    addColorVariant(value);
  }

  function submitCustomColor() {
    const normalized = customColor.trim();
    if (!normalized) return;
    addColorVariant(normalized);
    setCustomColor("");
    setShowCustomColorInput(false);
    setColorPickerValue(COLOR_PRESETS[0]?.name ?? "Black");
  }

  function submitCustomSize() {
    const normalized = customSize.trim();
    if (!normalized) return;
    addSize(normalized);
    setCustomSize("");
  }

  function submitTag() {
    const normalized = tagInput.trim();
    if (!normalized) return;
    addTag(normalized);
    setTagInput("");
  }

  function getCropFocus(colorId: string): "center" | "north" | "south" | "east" | "west" {
    return cropFocusByColor[colorId] ?? "center";
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Sizes</p>
            <p className="mt-1 text-sm text-[#222222]">Multi-select preset sizes or add a custom one.</p>
          </div>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            {sizes.length} selected
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {SIZE_PRESETS.map((size) => {
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
            placeholder="Add custom size and press Enter"
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

      <section className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Colors</p>
            <p className="mt-1 text-sm text-[#222222]">Add a color and upload its own images inside that color card.</p>
          </div>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            {colorVariants.length} variants
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <select
              value={colorPickerValue}
              onChange={(event) => handleColorSelect(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-neutral-300 bg-white px-4 pr-10 text-sm text-[#111111] outline-none transition focus:border-[#111111]"
            >
              {COLOR_PRESETS.map((color) => (
                <option key={color.name} value={color.name}>
                  Add {color.name}
                </option>
              ))}
              <option value={CUSTOM_COLOR_VALUE}>Add Custom Color</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">+</span>
          </div>
        </div>

        {showCustomColorInput ? (
          <div className="mt-3 rounded-xl border border-neutral-300 bg-white px-3 py-2">
            <input
              value={customColor}
              onChange={(event) => setCustomColor(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submitCustomColor();
                }
              }}
              placeholder="Type custom color and press Enter"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>
        ) : null}

        <div className="mt-4 space-y-4">
          {colorVariants.map((variant, index) => (
            <article key={variant.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-8 w-8 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: variant.swatch }}
                  />
                  <div>
                    <p className="text-sm uppercase tracking-[0.12em] text-[#111111]">{variant.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                      {index === 0 ? "Default storefront color" : "Alternate color"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {index !== 0 ? (
                    <button
                      type="button"
                      onClick={() => makeDefaultColorVariant(variant.id)}
                      className="rounded-full border border-neutral-300 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
                    >
                      Make Default
                    </button>
                  ) : null}
                  {colorVariants.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeColorVariant(variant.id)}
                      className="rounded-full border border-red-200 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-red-600 hover:border-red-500"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr,90px]">
                <input
                  value={variant.name}
                  onChange={(event) => updateColorVariant(variant.id, { name: event.target.value })}
                  className="h-11 rounded-xl border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]"
                />
                <input
                  type="color"
                  value={variant.swatch}
                  onChange={(event) => updateColorVariant(variant.id, { swatch: event.target.value })}
                  className="h-11 w-full rounded-xl border border-neutral-300 p-1"
                />
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[200px,1fr]">
                <div>
                  <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                    {variant.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={variant.image} alt={`${variant.name} preview`} className="aspect-[4/5] w-full object-cover" />
                    ) : (
                      <div className="flex aspect-[4/5] items-center justify-center text-sm text-neutral-500">
                        No color image
                      </div>
                    )}
                  </div>
                  <label className="mt-3 inline-flex cursor-pointer rounded-full border border-[#111111] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:bg-[#111111] hover:text-white">
                    {uploading ? "Uploading..." : "Upload Cover"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(event) => void handleColorImageUpload(variant.id, event.target.files, getCropFocus(variant.id))}
                    />
                  </label>
                  <select
                    value={getCropFocus(variant.id)}
                    onChange={(event) =>
                      setCropFocusByColor((current) => ({
                        ...current,
                        [variant.id]: event.target.value as "center" | "north" | "south" | "east" | "west",
                      }))
                    }
                    className="mt-3 h-10 w-full rounded-full border border-neutral-300 bg-white px-3 text-[11px] uppercase tracking-[0.14em] text-[#111111] outline-none focus:border-[#111111]"
                  >
                    <option value="center">Crop Center</option>
                    <option value="north">Crop Top</option>
                    <option value="south">Crop Bottom</option>
                    <option value="east">Crop Right</option>
                    <option value="west">Crop Left</option>
                  </select>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Color Gallery</p>
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

                  <div className="grid gap-3 sm:grid-cols-2">
                    {variant.images.map((image, imageIndex) => (
                      <div
                        key={`${variant.id}-${image}-${imageIndex}`}
                        className="rounded-xl border border-neutral-200 p-2"
                        draggable
                        onDragStart={(event) =>
                          event.dataTransfer.setData("text/color-gallery-index", `${variant.id}:${imageIndex}`)
                        }
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          const payload = event.dataTransfer.getData("text/color-gallery-index");
                          const [fromColorId, fromIndexValue] = payload.split(":");
                          const fromIndex = Number(fromIndexValue);
                          if (fromColorId === variant.id && !Number.isNaN(fromIndex)) {
                            reorderColorGalleryImages(variant.id, fromIndex, imageIndex);
                          }
                        }}
                      >
                        <div className="overflow-hidden rounded-lg border border-neutral-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={image} alt={`${variant.name} ${imageIndex + 1}`} className="aspect-[4/5] w-full object-cover" />
                        </div>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                          Drag to reorder
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <label className="cursor-pointer rounded-full border border-neutral-300 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading}
                              onChange={(event) =>
                                void handleColorGalleryReplace(variant.id, imageIndex, event.target.files)
                              }
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeColorGalleryImage(variant.id, imageIndex)}
                            className="rounded-full border border-red-200 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-red-600 hover:border-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
