"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

interface PremiumProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  hoverImage?: string;
  category?: string;
  slug: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
}

export default function PremiumProductCard({
  id,
  title,
  price,
  image,
  hoverImage,
  category,
  slug,
  isNew,
  isSale,
  salePrice,
}: PremiumProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;

    setTilt({
      x: x * 8,
      y: y * 8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const priceDisplay = isSale && salePrice ? salePrice : price;
  const originalPrice = isSale ? price : null;

  return (
    <Link href={`/product/${slug}`}>
      <motion.div
        ref={cardRef}
        className="group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Container with Shadow Depth */}
        <motion.div
          className="relative mb-4 overflow-hidden bg-neutral-100"
          style={{
            aspectRatio: "1",
            perspective: "1000px",
          }}
          animate={{
            rotateX: tilt.x,
            rotateY: tilt.y,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          {/* Soft shadow depth effect */}
          <motion.div
            className="absolute inset-0 shadow-2xl"
            animate={{
              boxShadow: isHovered
                ? "0 40px 60px -15px rgba(0,0,0,0.2)"
                : "0 10px 25px -5px rgba(0,0,0,0.05)",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Primary Image */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: isHovered && hoverImage ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>

          {/* Hover Image (Image Swap) */}
          {hoverImage && (
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={hoverImage}
                alt={`${title} alternate view`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          )}

          {/* Badge Container */}
          <div className="absolute right-0 top-0 z-10 flex flex-col gap-2 p-3">
            {isNew && (
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block bg-black px-3 py-1 text-xs font-medium uppercase tracking-wider text-white"
              >
                New
              </motion.span>
            )}
            {isSale && (
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block bg-red-600 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white"
              >
                Sale
              </motion.span>
            )}
          </div>

          {/* Hover Overlay Text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/0"
            animate={{
              backgroundColor: isHovered ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-xs uppercase tracking-[0.2em] text-white"
            >
              View Details
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Product Info */}
        <div className="space-y-3">
          {/* Category */}
          {category && (
            <motion.p
              animate={{ opacity: isHovered ? 0.7 : 0.5 }}
              className="text-xs uppercase tracking-[0.1em] text-neutral-500"
            >
              {category}
            </motion.p>
          )}

          {/* Title */}
          <motion.h3
            animate={{
              color: isHovered ? "#111111" : "#333333",
            }}
            className="font-light leading-snug transition-colors duration-300"
          >
            {title}
          </motion.h3>

          {/* Price */}
          <div className="flex items-center gap-3">
            <motion.p
              animate={{
                color: isSale ? "#d32f2f" : "#111111",
                fontWeight: isSale ? 600 : 500,
              }}
              className="text-sm transition-all duration-300"
            >
              ${priceDisplay.toFixed(2)}
            </motion.p>
            {originalPrice && (
              <motion.p className="text-xs text-neutral-400 line-through">
                ${originalPrice.toFixed(2)}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
