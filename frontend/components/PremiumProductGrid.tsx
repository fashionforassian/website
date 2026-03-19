"use client";

import { motion } from "framer-motion";
import PremiumProductCard from "./PremiumProductCard";
import SectionHeading from "./SectionHeading";

interface Product {
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

interface PremiumProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
}

export default function PremiumProductGrid({
  products,
  title = "New Arrivals",
  subtitle = "Latest Collection",
  columns = 4,
}: PremiumProductGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <SectionHeading title={title} subtitle={subtitle} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className={`grid gap-6 md:gap-8 ${gridCols[columns]}`}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <PremiumProductCard {...product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
