export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-14 md:px-8 md:py-20">
      <header className="mb-10">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">Contact</p>
        <h1 className="font-heading text-3xl text-[#111111] sm:text-4xl md:text-5xl">Get In Touch</h1>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <form className="space-y-4 border border-neutral-200 p-6" action="#">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-[0.15em] text-neutral-500">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none transition focus:border-[#111111]"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.15em] text-neutral-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none transition focus:border-[#111111]"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.15em] text-neutral-500">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              required
              className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-[#111111]"
            />
          </div>
          <button
            type="submit"
            className="border border-[#111111] bg-[#111111] px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#111111]"
          >
            Send Message
          </button>
        </form>

        <aside className="space-y-6 border border-neutral-200 p-6">
          <div>
            <h2 className="mb-2 text-xs uppercase tracking-[0.18em] text-neutral-500">Email</h2>
            <p className="text-sm text-[#222222]">hello@fashionasia.com</p>
          </div>
          <div>
            <h2 className="mb-2 text-xs uppercase tracking-[0.18em] text-neutral-500">Social</h2>
            <ul className="space-y-2 text-sm text-[#222222]">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111]">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111]">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111]">
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xs uppercase tracking-[0.18em] text-neutral-500">Studio</h2>
            <p className="text-sm text-[#222222]">2F, Seongsu Fashion District, Seoul</p>
          </div>
        </aside>
      </section>

      <section className="mt-10 border border-neutral-200">
        <div className="flex h-60 items-center justify-center bg-neutral-100 text-sm uppercase tracking-[0.12em] text-neutral-500 sm:h-72">
          Minimal Map Placeholder
        </div>
      </section>
    </main>
  );
}
