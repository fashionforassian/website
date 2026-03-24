"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/data";

type ShowcaseItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  href: string;
  caption: string;
};

type EditorialShowcaseProps = {
  items: ShowcaseItem[];
};

export default function EditorialShowcase({ items }: EditorialShowcaseProps) {
  const featuredItems = items.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fcfaf7_0%,#f6f0e8_54%,#ffffff_100%)] py-20 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
      <div className="pointer-events-none absolute left-[8%] top-16 h-48 w-48 rounded-full bg-[#eadfce] blur-[110px]" />
      <div className="pointer-events-none absolute right-[10%] top-24 h-56 w-56 rounded-full bg-[#efe6da] blur-[120px]" />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative z-10"
        >
          <span className="inline-flex rounded-full border border-neutral-300 bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-neutral-500 backdrop-blur-sm">
            Editorial Motion
          </span>
          <h2 className="mt-6 max-w-xl font-playfair text-4xl font-light leading-tight text-[#111111] sm:text-5xl md:text-6xl">
            A cleaner studio feel with movement that does not slow the page down.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
            The homepage now uses lighter motion language: layered reveals, soft hover lift,
            and cleaner editorial framing instead of heavy 3D interaction.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#111111] px-7 py-3 text-xs uppercase tracking-[0.22em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-black"
            >
              Browse Everything
            </Link>
            <Link
              href="/new-arrivals"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white/80 px-7 py-3 text-xs uppercase tracking-[0.22em] text-[#111111] transition-transform duration-300 hover:-translate-y-0.5 hover:border-[#111111]"
            >
              Latest Drop
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Live Catalog", value: `${items.length}+ styles` },
              { label: "Motion Style", value: "Lightweight" },
              { label: "Visual Tone", value: "Editorial" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.12 + index * 0.08, ease: "easeOut" }}
                className="rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-[0_16px_45px_rgba(17,17,17,0.04)] backdrop-blur-sm"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{stat.label}</p>
                <p className="mt-3 font-playfair text-2xl text-[#111111]">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative min-h-[540px]">
          {featuredItems.map((item, index) => {
            const layouts = [
              "left-0 top-10 w-[58%] md:w-[54%]",
              "right-0 top-0 w-[54%] md:w-[48%]",
              "left-[18%] bottom-0 w-[56%] md:left-[22%] md:w-[50%]",
            ];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 34, rotate: index === 1 ? 4 : index === 2 ? -3 : -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: index === 1 ? 2 : index === 2 ? -2 : -3 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: index * 0.12, ease: "easeOut" }}
                animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
                className={`absolute ${layouts[index] ?? layouts[0]}`}
                style={{ zIndex: 10 + index }}
              >
                <Link href={item.href} className="group block">
                  <motion.article
                    whileHover={{ y: -10, rotate: 0, transition: { duration: 0.22, ease: "easeOut" } }}
                    className="overflow-hidden rounded-[28px] border border-white/70 bg-white p-3 shadow-[0_22px_80px_rgba(17,17,17,0.1)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-neutral-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_42%,rgba(0,0,0,0.2)_100%)]" />
                    </div>

                    <div className="space-y-2 px-2 pb-2 pt-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                        {item.caption}
                      </p>
                      <h3 className="font-playfair text-xl font-light text-[#111111]">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-neutral-600">{formatPrice(item.price)}</p>
                        <span className="text-[11px] uppercase tracking-[0.16em] text-[#111111] transition-transform duration-300 group-hover:translate-x-1">
                          View
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
