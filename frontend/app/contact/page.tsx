export default function ContactPage() {
  return (
    <main className="w-full bg-white">
      <section className="mx-auto w-full max-w-[1200px] px-4 py-24 md:px-8">
        <header className="mb-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-500">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black">Get In Touch</h1>
        </header>

        <section className="grid gap-12 md:grid-cols-[1.5fr,1fr] max-w-5xl mx-auto">
          <form className="space-y-6" action="#">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="mb-3 block text-xs font-bold uppercase tracking-widest text-black">First Name</label>
                <input id="firstName" type="text" required className="w-full border-b border-gray-300 py-3 text-sm outline-none transition focus:border-black bg-transparent" placeholder="Jane" />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-3 block text-xs font-bold uppercase tracking-widest text-black">Last Name</label>
                <input id="lastName" type="text" required className="w-full border-b border-gray-300 py-3 text-sm outline-none transition focus:border-black bg-transparent" placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="mb-3 block text-xs font-bold uppercase tracking-widest text-black">Email</label>
              <input id="email" type="email" required className="w-full border-b border-gray-300 py-3 text-sm outline-none transition focus:border-black bg-transparent" placeholder="jane@example.com" />
            </div>
            
            <div>
              <label htmlFor="message" className="mb-3 block text-xs font-bold uppercase tracking-widest text-black">Message</label>
              <textarea id="message" rows={4} required className="w-full border-b border-gray-300 py-3 text-sm outline-none transition focus:border-black bg-transparent resize-none" placeholder="How can we help?" />
            </div>
            
            <button type="submit" className="w-full bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors mt-4">
              Send Message
            </button>
          </form>

          <aside className="space-y-10 border-l border-gray-200 pl-12">
            <div>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">Email</h2>
              <p className="text-sm text-black">hello@fassion4asian.com</p>
            </div>
            <div>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">Studio</h2>
              <p className="text-sm text-black leading-relaxed">2F, Seongsu Fashion District<br/>Seoul, South Korea</p>
            </div>
            <div>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">Social</h2>
              <ul className="space-y-3 text-sm text-black">
                <li><a href="#" className="hover:text-gray-500 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-gray-500 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-gray-500 transition-colors">Pinterest</a></li>
              </ul>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
