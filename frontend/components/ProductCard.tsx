import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { formatPrice, type Product } from "@/lib/data";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group">
      <div className="relative h-80 overflow-hidden bg-neutral-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        <Link
          href={`/product/${product.slug}`}
          className="absolute bottom-3 left-3 border border-[#111111] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-[#111111] opacity-0 transition group-hover:opacity-100"
        >
          Quick View
        </Link>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm uppercase tracking-[0.12em] text-[#111111]">{product.name}</h3>
        <p className="text-sm text-[#222222]">{formatPrice(product.price)}</p>
        <AddToCartButton
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
          }}
          size={product.sizes[0]}
          color={product.colors[0]}
          className="mt-2 border border-neutral-300 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#111111] hover:border-[#111111] hover:bg-[#111111] hover:text-white"
        />
      </div>
    </article>
  );
}
