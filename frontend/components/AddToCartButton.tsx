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
    inventory?: number;
    status?: "active" | "draft" | "archived";
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
  const isAvailable = (product.status ?? "active") === "active" && (product.inventory ?? 1) > 0;

  const handleAdd = () => {
    if (!isAvailable) {
      return;
    }

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
      disabled={!isAvailable}
      onClick={handleAdd}
      className={
        className ??
        "border border-[#111111] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#111111] hover:bg-[#111111] hover:text-white disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-400 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
      }
    >
      {!isAvailable ? "Out Of Stock" : added ? "Added" : "Add To Cart"}
    </button>
  );
}
