"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";

type AddToCartControlsProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    price: number;
    sizes: string[];
    colors: string[];
    inventory: number;
    status: "active" | "draft" | "archived";
  };
};

export default function AddToCartControls({ product }: AddToCartControlsProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] ?? "One Size");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] ?? "Default");
  const [added, setAdded] = useState(false);
  const isAvailable = product.status === "active" && product.inventory > 0;

  const canAdd = useMemo(
    () => Boolean(selectedSize && selectedColor && isAvailable),
    [isAvailable, selectedColor, selectedSize],
  );

  const handleAdd = () => {
    if (!canAdd) {
      return;
    }

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <div>
      <div className="mt-8">
        <h2 className="mb-3 text-xs uppercase tracking-[0.18em] text-neutral-500">Size</h2>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => {
            const isActive = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.12em] transition ${
                  isActive
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-neutral-300 text-[#222222] hover:border-[#111111]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-xs uppercase tracking-[0.18em] text-neutral-500">Color</h2>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => {
            const isActive = selectedColor === color;

            return (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.12em] transition ${
                  isActive
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-neutral-300 text-[#222222] hover:border-[#111111]"
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={!canAdd}
        onClick={handleAdd}
        className="mt-8 w-full border border-[#111111] bg-[#111111] px-6 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#111111] disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-300 disabled:text-white sm:w-auto"
      >
        {!isAvailable ? "Out Of Stock" : added ? "Added To Cart" : "Add To Cart"}
      </button>
      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-neutral-500">
        {isAvailable ? `${product.inventory} In Stock` : "Currently unavailable"}
      </p>
    </div>
  );
}
