"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type HeroStat = {
  value: string;
  label: string;
};

type HeroLink = {
  label: string;
  href: string;
};

type HeroSpotlight = {
  title: string;
  subtitle?: string;
  price?: string;
  image: string;
  href: string;
};

interface ParallaxHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  backgroundImage?: string;
  announcement?: string;
  stats?: HeroStat[];
  quickLinks?: HeroLink[];
  spotlight?: HeroSpotlight;
  secondarySpotlight?: HeroSpotlight;
}

export default function ParallaxHero({
  title,
  subtitle,
  description = "Modern menswear, kids essentials, footwear, and accessories arranged in a cleaner live catalog with sharper visuals and faster browsing.",
  ctaText = "Explore Collection",
  ctaHref = "/products",
  secondaryCtaText = "Shop New Arrivals",
  secondaryCtaHref = "/new-arrivals",
  backgroundImage = "https://images.pexels.com/photos/5378700/pexels-photo-5378700.jpeg?auto=compress&cs=tinysrgb&w=1600",
  announcement = "Fresh drop: live catalog, curated edits, and faster discovery.",
  stats = [
    { value: "24-48h", label: "delivery window" },
    { value: "14-day", label: "easy returns" },
    { value: "Live", label: "catalog updates" },
  ],
  quickLinks = [
    { label: "Men", href: "/men" },
    { label: "Kids", href: "/kids" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Sale", href: "/sale" },
  ],
  spotlight,
  secondarySpotlight,
}: ParallaxHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#f6f0e7] text-[#111111]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#faf6ef_0%,#f3ebdf_40%,#eee2d1_100%)]" />
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#ddc1a0]/45 blur-3xl" />
      <div className="absolute right-[-8%] top-12 h-[28rem] w-[28rem] rounded-full bg-[#b78756]/18 blur-3xl" />
      <div className="absolute bottom-[-10rem] left-[18%] h-80 w-80 rounded-full bg-white/55 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(17,17,17,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.08)_1px,transparent_1px)] [background-size:120px_120px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 md:pb-[4.5rem] md:pt-14 lg:px-8 lg:pb-20 lg:pt-[4.5rem]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr,0.96fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-[#111111]/10 bg-white/75 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-neutral-600 shadow-[0_18px_50px_rgba(17,17,17,0.05)] backdrop-blur-sm sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-[#b78756]" />
              {announcement}
            </div>

            {subtitle ? (
              <p className="mt-8 text-[11px] uppercase tracking-[0.34em] text-neutral-500 sm:text-xs">
                {subtitle}
              </p>
            ) : null}

            <h1 className="mt-5 max-w-3xl font-playfair text-5xl font-light leading-[0.96] text-[#111111] sm:text-6xl lg:text-[5.4rem]">
              {title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={ctaHref}
                className="group inline-flex items-center justify-center rounded-full bg-[#111111] px-7 py-3 text-xs uppercase tracking-[0.22em] text-white shadow-[0_18px_45px_rgba(17,17,17,0.18)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-black"
              >
                {ctaText}
                <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                  +
                </span>
              </Link>
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-full border border-[#111111]/12 bg-white/78 px-7 py-3 text-xs uppercase tracking-[0.22em] text-[#111111] shadow-[0_14px_36px_rgba(17,17,17,0.05)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 hover:border-[#111111]/28 hover:bg-white"
              >
                {secondaryCtaText}
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {stats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.06, ease: "easeOut" }}
                  className="rounded-[26px] border border-white/75 bg-white/76 p-4 shadow-[0_18px_45px_rgba(17,17,17,0.05)] backdrop-blur-sm"
                >
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-[#111111] sm:text-[1.75rem]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500 sm:text-[11px]">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500 sm:text-[11px]">
                Quick Entry
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {quickLinks.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.18 + index * 0.05, ease: "easeOut" }}
                  >
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-3 rounded-full border border-[#111111]/10 bg-white/70 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[#111111] shadow-[0_16px_40px_rgba(17,17,17,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#111111]/25 hover:bg-white"
                    >
                      <span>{item.label}</span>
                      <span className="text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#111111]">
                        +
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="relative min-h-[540px] sm:min-h-[620px] lg:min-h-[680px]"
          >
            <div className="absolute inset-[7%_2%_7%_10%] overflow-hidden rounded-[40px] border border-white/55 bg-white/28 shadow-[0_30px_100px_rgba(17,17,17,0.08)] backdrop-blur-md">
              <Image
                src={backgroundImage}
                alt="Hero ambiance"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover opacity-[0.18]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.08)_38%,rgba(17,17,17,0.08)_100%)]" />
            </div>

            {spotlight ? (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 top-0 w-[84%] max-w-[480px]"
              >
                <Link href={spotlight.href} className="group block">
                  <div className="overflow-hidden rounded-[38px] border border-white/70 bg-white/82 p-3 shadow-[0_28px_90px_rgba(17,17,17,0.12)] backdrop-blur-md">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] bg-[#e6ddd0]">
                      <Image
                        src={spotlight.image}
                        alt={spotlight.title}
                        fill
                        priority
                        sizes="(min-width: 1024px) 32vw, 82vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_34%,rgba(0,0,0,0.56)_100%)]" />
                      <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-[rgba(0,0,0,0.18)] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md">
                        Live Spotlight
                      </div>
                    </div>

                    <div className="mt-3 rounded-[28px] bg-[#111111] px-5 py-5 text-white">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">
                            {spotlight.subtitle ?? "Featured Product"}
                          </p>
                          <h3 className="mt-3 font-playfair text-2xl font-light leading-tight sm:text-[2rem]">
                            {spotlight.title}
                          </h3>
                        </div>
                        {spotlight.price ? (
                          <span className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white/88">
                            {spotlight.price}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/72">
                        <span>Open product</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ) : null}

            {secondarySpotlight ? (
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-0 w-[58%] max-w-[310px]"
              >
                <Link href={secondarySpotlight.href} className="group block">
                  <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/82 p-3 shadow-[0_22px_70px_rgba(17,17,17,0.1)] backdrop-blur-md">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#e7dfd6]">
                      <Image
                        src={secondarySpotlight.image}
                        alt={secondarySpotlight.title}
                        fill
                        sizes="(min-width: 1024px) 18vw, 48vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_42%,rgba(17,17,17,0.16)_100%)]" />
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3 px-2 pb-1">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                          {secondarySpotlight.subtitle ?? "New Arrival"}
                        </p>
                        <h3 className="mt-2 font-playfair text-xl font-light text-[#111111]">
                          {secondarySpotlight.title}
                        </h3>
                        {secondarySpotlight.price ? (
                          <p className="mt-2 text-sm text-neutral-600">{secondarySpotlight.price}</p>
                        ) : null}
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#111111]/10 bg-[#f5efe7] text-lg text-[#111111] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        +
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ) : null}

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-4 top-10 hidden w-60 rounded-[30px] border border-white/70 bg-white/84 p-5 text-[#111111] shadow-[0_18px_65px_rgba(17,17,17,0.08)] backdrop-blur-md xl:block"
            >
              <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Why it works</p>
              <div className="mt-5 space-y-4">
                {[
                  "Stronger landing visuals",
                  "Direct product entry points",
                  "Cleaner browsing from first screen",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#b78756]" />
                    <p className="text-sm leading-6 text-neutral-700">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
