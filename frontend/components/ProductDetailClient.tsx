"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice, type Product } from "@/lib/data";

type ProductDetailClientProps = {
  product: Product;
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const colorVariants = product.colorVariants.length
    ? product.colorVariants
    : [
        {
          id: "default",
          name: product.colors[0] ?? "Default",
          swatch: "#D4CEC3",
          image: product.image,
          images: product.images,
        },
      ];

  const [selectedColorId, setSelectedColorId] = useState(colorVariants[0]?.id ?? "default");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "One Size");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(
    () => colorVariants.find((variant) => variant.id === selectedColorId) ?? colorVariants[0],
    [colorVariants, selectedColorId],
  );
  const galleryImages = selectedVariant?.images.length ? selectedVariant.images : product.images;
  const currentImage = galleryImages[selectedImageIndex] ?? selectedVariant?.image ?? product.image;
  const isAvailable = product.status === "active" && product.inventory > 0;

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedColorId]);

  const handleAddToCart = () => {
    if (!selectedVariant || !isAvailable) {
      return;
    }

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: currentImage,
      price: product.price,
      size: selectedSize,
      color: selectedVariant.name,
      quantity: 1,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
      <div className="grid gap-4 lg:grid-cols-[96px,1fr] xl:grid-cols-[104px,1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible">
          {galleryImages.map((image, index) => {
            const isActive = index === selectedImageIndex;

            return (
              <button
                key={`${selectedVariant?.id ?? "default"}-${image}-${index}`}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-[4/5] w-[4.5rem] flex-none overflow-hidden border transition sm:w-20 lg:w-24 ${
                  isActive ? "border-[#111111]" : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <Image src={image} alt={`${product.name} preview ${index + 1}`} fill className="object-cover" />
              </button>
            );
          })}
        </div>

        <div className="order-1 relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 lg:order-2">
          <Image src={currentImage} alt={product.name} fill priority className="object-cover" />
        </div>
      </div>

      <article className="max-w-xl">
        <h1 className="font-heading text-3xl text-[#111111] sm:text-4xl">{product.name}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-2xl text-[#222222]">{formatPrice(product.price)}</p>
          {product.compareAtPrice ? (
            <p className="text-base text-neutral-400 line-through">{formatPrice(product.compareAtPrice)}</p>
          ) : null}
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xs uppercase tracking-[0.18em] text-neutral-500">Color</h2>
            <p className="text-xs uppercase tracking-[0.16em] text-[#111111]">
              {selectedVariant?.name ?? product.colors[0]}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {colorVariants.map((variant) => {
              const isActive = variant.id === selectedColorId;

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedColorId(variant.id)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 transition sm:gap-3 ${
                    isActive
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-neutral-300 bg-white text-[#111111] hover:border-[#111111]"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full border ${isActive ? "border-white/70" : "border-black/10"}`}
                    style={{ backgroundColor: variant.swatch }}
                  />
                  <span className="text-xs uppercase tracking-[0.14em]">{variant.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xs uppercase tracking-[0.18em] text-neutral-500">Size</h2>
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Select One</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const isActive = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-12 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.12em] transition ${
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

        <button
          type="button"
          disabled={!isAvailable}
          onClick={handleAddToCart}
          className="mt-8 w-full rounded-full border border-[#111111] bg-[#111111] px-6 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#111111] disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-300 disabled:text-white sm:w-auto"
        >
          {!isAvailable ? "Out Of Stock" : added ? "Added To Cart" : "Add To Cart"}
        </button>
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-neutral-500">
          {isAvailable ? "In Stock" : "Currently unavailable"}
        </p>

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <h2 className="mb-2 text-xs uppercase tracking-[0.18em] text-neutral-500">Product Description</h2>
          <p className="text-sm leading-7 text-[#222222]">{product.description}</p>
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-6">
          <h2 className="mb-2 text-xs uppercase tracking-[0.18em] text-neutral-500">Fabric & Care</h2>
          <p className="text-sm leading-7 text-[#222222]">{product.fabricCare}</p>
        </div>
      </article>
    </section>
  );
}
