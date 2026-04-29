import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold uppercase tracking-tight text-black mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">1. Information We Collect</h2>
          <p>
            When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
          </p>
          <p className="mt-2">
            Additionally, as you browse the site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the site, and information about how you interact with the site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">2. How We Use Your Information</h2>
          <p>
            We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">3. Sharing Your Personal Information</h2>
          <p>
            We share your Personal Information with third parties to help us use your Personal Information, as described above. We also use Google Analytics to help us understand how our customers use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">4. Your Rights</h2>
          <p>
            If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">5. Data Retention</h2>
          <p>
            When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">6. Changes</h2>
          <p>
            We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href="/" className="text-sm font-medium uppercase tracking-widest text-black hover:text-gray-500">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
