import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

const footerLinks = {
  Shop: [
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Men", href: "/category/men" },
    { label: "Kids", href: "/category/kids" },
    { label: "Accessories", href: "/category/accessories" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Campaigns", href: "/about" },
    { label: "Careers", href: "/contact" },
    { label: "Press", href: "/contact" },
  ],
  Help: [
    { label: "Shipping", href: "/contact" },
    { label: "Returns", href: "/contact" },
    { label: "Size Guide", href: "/contact" },
    { label: "FAQ", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-4 py-12 sm:gap-10 md:grid-cols-2 md:px-8 lg:grid-cols-5 lg:py-14">
        {Object.entries(footerLinks).map(([section, links]) => (
          <section key={section}>
            <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-[#111111]">{section}</h3>
            <ul className="space-y-2 text-sm text-[#222222]">
              {links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#111111]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="md:col-span-2 lg:col-span-2">
          <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-[#111111]">Newsletter</h3>
          <p className="mb-4 max-w-sm text-sm leading-6 text-[#222222]">
            Receive collection updates, editorial stories, and early access to seasonal releases.
          </p>
          <NewsletterForm
            source="footer"
            className="flex flex-col gap-3 sm:flex-row"
            inputClassName="h-11 w-full border border-neutral-300 px-4 text-sm outline-none transition focus:border-[#111111]"
            buttonClassName="h-11 border border-[#111111] bg-[#111111] px-6 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#111111] disabled:opacity-60"
          />
          <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.14em] text-[#222222]">
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111]">
              Instagram
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111]">
              Facebook
            </Link>
            <Link href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111]">
              Pinterest
            </Link>
          </div>
        </section>
      </div>

      <div className="border-t border-neutral-200">
        <p className="mx-auto w-full max-w-[1400px] px-4 py-5 text-[10px] uppercase tracking-[0.12em] text-neutral-500 sm:text-xs md:px-8">
          Copyright {new Date().getFullYear()} Fassion 4 Asian. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
