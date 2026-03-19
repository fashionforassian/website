type FilterSidebarProps = {
  title?: string;
};

const categories = ["All", "Men", "Women", "Accessories", "Footwear"];
const sizes = ["XS", "S", "M", "L", "XL", "One Size"];
const colors = ["Black", "White", "Beige", "Brown", "Muted Gold"];

export default function FilterSidebar({ title = "Filter" }: FilterSidebarProps) {
  return (
    <aside className="h-fit border border-neutral-200 p-5">
      <h2 className="mb-5 text-xs uppercase tracking-[0.2em] text-[#111111]">{title}</h2>

      <div className="space-y-6 text-sm">
        <section>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">Category</h3>
          <ul className="space-y-2 text-[#222222]">
            {categories.map((category) => (
              <li key={category} className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 border-neutral-300" />
                <span>{category}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">Price</h3>
          <ul className="space-y-2 text-[#222222]">
            <li className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 border-neutral-300" />
              <span>Under $100</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 border-neutral-300" />
              <span>$100 - $200</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 border-neutral-300" />
              <span>Above $200</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                className="border border-neutral-300 px-3 py-1 text-xs uppercase tracking-[0.12em] text-[#222222] hover:border-[#111111] hover:text-[#111111]"
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">Color</h3>
          <ul className="space-y-2 text-[#222222]">
            {colors.map((color) => (
              <li key={color} className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 border-neutral-300" />
                <span>{color}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
