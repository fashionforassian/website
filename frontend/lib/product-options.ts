export const COLOR_PRESETS = [
  { name: "Black", swatch: "#111111" },
  { name: "White", swatch: "#F8F8F5" },
  { name: "Ivory", swatch: "#F4EDE1" },
  { name: "Beige", swatch: "#D8C3A5" },
  { name: "Sand", swatch: "#C9B18A" },
  { name: "Stone", swatch: "#B8B1A9" },
  { name: "Taupe", swatch: "#8F7A68" },
  { name: "Cocoa", swatch: "#6B4F3F" },
  { name: "Mocha", swatch: "#7B5E57" },
  { name: "Camel", swatch: "#B88A4A" },
  { name: "Brown", swatch: "#6B4423" },
  { name: "Charcoal", swatch: "#36454F" },
  { name: "Grey", swatch: "#8B8B8B" },
  { name: "Navy", swatch: "#1F2A44" },
  { name: "Blue", swatch: "#355C9A" },
  { name: "Sky Blue", swatch: "#8ECAE6" },
  { name: "Olive", swatch: "#66754D" },
  { name: "Green", swatch: "#3E6B48" },
  { name: "Muted Gold", swatch: "#C6A664" },
  { name: "Gold", swatch: "#D4AF37" },
  { name: "Silver", swatch: "#C0C0C0" },
  { name: "Red", swatch: "#A33A2B" },
  { name: "Burgundy", swatch: "#6E1F33" },
  { name: "Pink", swatch: "#D8A7B1" },
] as const;

export const SIZE_PRESETS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "One Size",
] as const;

export function getColorSwatchValue(name: string, fallback?: string): string {
  const normalizedName = name.trim().toLowerCase();
  const matched = COLOR_PRESETS.find((color) => color.name.toLowerCase() === normalizedName);
  return matched?.swatch ?? fallback?.trim() ?? "#D4CEC3";
}

