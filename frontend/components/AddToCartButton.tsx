"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";

type AddToCartButtonProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    price: number;
  };
  size?: string;
  color?: string;
  className?: string;
};

export default function AddToCartButton({
  product,
  size,
  color,
  className,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      size,
      color,
      quantity: 1,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={
        className ??
        "border border-[#111111] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#111111] hover:bg-[#111111] hover:text-white"
      }
    >
      {added ? "Added" : "Add To Cart"}
    </button>
  );
}
