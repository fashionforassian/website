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
  const colorVariants = useMemo(
    () =>
      product.colorVariants.length
        ? product.colorVariants
        : [
            {
              id: "default",
              name: product.colors[0] ?? "Default",
              swatch: "#D4CEC3",
              image: product.image,
              images: product.images,
            },
          ],
    [product.colorVariants, product.colors, product.image, product.images],
  );
  const variantStocks = Array.isArray(product.variantStocks) ? product.variantStocks : [];
  const hasVariantStocks = variantStocks.length > 0;

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
  const selectedStock = hasVariantStocks
    ? variantStocks.find((stock) => stock.color === selectedVariant?.name && stock.size === selectedSize)
    : null;
  const selectedPrice = selectedStock?.price ?? product.price;
  const isAvailable = product.status === "active" && (hasVariantStocks ? (selectedStock?.inventory ?? 0) > 0 : product.inventory > 0);

  const availableSizes = useMemo(() => {
    if (!hasVariantStocks) return product.sizes;
    return product.sizes.filter((size) => variantStocks.some((stock) => stock.color === selectedVariant?.name && stock.size === size && stock.inventory > 0));
  }, [hasVariantStocks, product.sizes, selectedVariant?.name, variantStocks]);

  const availableColors = useMemo(() => {
    if (!hasVariantStocks) return colorVariants;
    return colorVariants.filter((variant) => variantStocks.some((stock) => stock.size === selectedSize && stock.color === variant.name && stock.inventory > 0));
  }, [colorVariants, hasVariantStocks, selectedSize, variantStocks]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedColorId]);

  useEffect(() => {
    if (!hasVariantStocks) return;
    const preferred = variantStocks.find((stock) => stock.inventory > 0) ?? variantStocks[0];
    if (preferred) {
      setSelectedSize(preferred.size);
      const nextColor = colorVariants.find((variant) => variant.name === preferred.color);
      if (nextColor) {
        setSelectedColorId(nextColor.id);
      }
    }
  }, [colorVariants, hasVariantStocks, variantStocks]);

  const handleAddToCart = () => {
    if (!selectedVariant || !isAvailable) {
      return;
    }

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: currentImage,
      price: selectedPrice,
      size: selectedSize,
      color: selectedVariant.name,
      quantity: 1,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.62fr)] xl:items-start">
      <div className="grid gap-4 lg:grid-cols-[88px,1fr] xl:grid-cols-[96px,1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {galleryImages.map((image, index) => {
            const isActive = index === selectedImageIndex;

            return (
              <button
                key={`${selectedVariant?.id ?? "default"}-${image}-${index}`}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                style={{ aspectRatio: "4 / 5", width: "4rem" }}
                className={`relative flex-none overflow-hidden rounded-[18px] border transition sm:w-18 lg:w-20 ${
                  isActive ? "border-[#111111]" : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <Image src={image} alt={`${product.name} preview ${index + 1}`} fill className="object-cover" />
              </button>
            );
          })}
        </div>

        <div
          className="order-1 relative overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-100 shadow-[0_22px_70px_rgba(17,17,17,0.08)] lg:order-2"
          style={{ aspectRatio: "4 / 5", maxHeight: "760px" }}
        >
          <Image src={currentImage} alt={product.name} fill priority className="object-cover object-center" />
        </div>
      </div>

      <article className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_rgba(17,17,17,0.04)] xl:sticky xl:top-28 xl:max-w-none xl:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Product Details</p>
            <h1 className="mt-2 font-heading text-3xl text-[#111111] sm:text-4xl">{product.name}</h1>
          </div>
          {product.compareAtPrice ? (
            <p className="shrink-0 pt-2 text-base text-neutral-400 line-through">{formatPrice(product.compareAtPrice)}</p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-2xl text-[#222222]">{formatPrice(selectedPrice)}</p>
          <span className="rounded-full border border-neutral-200 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            {isAvailable ? "In stock" : "Out of stock"}
          </span>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xs uppercase tracking-[0.18em] text-neutral-500">Color</h2>
            <p className="text-xs uppercase tracking-[0.16em] text-[#111111]">
              {selectedVariant?.name ?? product.colors[0]}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {availableColors.map((variant) => {
              const isActive = variant.id === selectedColorId;
              const isDisabled = hasVariantStocks && !variantStocks.some((stock) => stock.color === variant.name && stock.size === selectedSize && stock.inventory > 0);

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedColorId(variant.id)}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-left transition sm:gap-2.5 ${
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
          <div className="flex flex-wrap gap-2.5">
            {availableSizes.map((size) => {
              const isActive = selectedSize === size;
              const isDisabled = hasVariantStocks && !variantStocks.some((stock) => stock.color === selectedVariant?.name && stock.size === size && stock.inventory > 0);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  disabled={isDisabled}
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
          className="mt-8 w-full rounded-full border border-[#111111] bg-[#111111] px-6 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#111111] disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-300 disabled:text-white"
        >
          {!isAvailable ? "Out Of Stock" : added ? "Added To Cart" : "Add To Cart"}
        </button>
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-neutral-500">
          {isAvailable ? "In Stock" : "Currently unavailable"}
        </p>

        <div className="mt-8 border-t border-neutral-200 pt-6">
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
