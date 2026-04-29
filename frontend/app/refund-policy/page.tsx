import Link from "next/link";

export default function RefundPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold uppercase tracking-tight text-black mb-8">Refund & Return Policy</h1>
      
      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">1. Return Window</h2>
          <p>
            We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.
          </p>
          <p className="mt-2">
            To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">2. Starting a Return</h2>
          <p>
            To start a return, you can contact us at support@fassion4asian.com. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">3. Damages and Issues</h2>
          <p>
            Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">4. Exceptions / Non-returnable Items</h2>
          <p>
            Certain types of items cannot be returned, like perishable goods, custom products (such as special orders or personalized items), and personal care goods. We also do not accept returns for hazardous materials, flammable liquids, or gases.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">5. Exchanges</h2>
          <p>
            The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black uppercase tracking-widest mb-4">6. Refunds</h2>
          <p>
            We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.
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
