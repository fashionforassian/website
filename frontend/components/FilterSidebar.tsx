type FilterSidebarProps = {
  title?: string;
  categories: string[];
  sizes: string[];
  colors: string[];
  selectedCategory: string;
  selectedSize: string;
  selectedColor: string;
  selectedPrice: string;
  onCategoryChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onReset: () => void;
};

const priceRanges = [
  { label: "All", value: "all" },
  { label: "Under ₹100", value: "under-100" },
  { label: "₹100 - ₹200", value: "100-200" },
  { label: "Above ₹200", value: "over-200" },
];

export default function FilterSidebar({
  title = "Filter",
  categories,
  sizes,
  colors,
  selectedCategory,
  selectedSize,
  selectedColor,
  selectedPrice,
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onPriceChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 lg:sticky lg:top-24">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xs uppercase tracking-[0.2em] text-[#111111]">{title}</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] uppercase tracking-[0.16em] text-neutral-500 hover:text-[#111111]"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5 text-sm">
        <section>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                  selectedCategory === category
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-neutral-300 text-[#222222] hover:border-[#111111]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">Price</h3>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => onPriceChange(range.value)}
                className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                  selectedPrice === range.value
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-neutral-300 text-[#222222] hover:border-[#111111]"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeChange(size)}
                className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                  selectedSize === size
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-neutral-300 text-[#222222] hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onColorChange(color)}
                className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                  selectedColor === color
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-neutral-300 text-[#222222] hover:border-[#111111]"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
