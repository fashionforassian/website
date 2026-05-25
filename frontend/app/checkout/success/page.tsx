import Link from "next/link";
import Image from "next/image";
import { buildBackendUrl } from "@/lib/backend-api";
import { formatPrice } from "@/lib/data";

type SearchParams = Promise<{
  orderId?: string | string[];
}>;

type CheckoutOrderItem = {
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
};

type CheckoutOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: CheckoutOrderItem[];
};

async function getOrder(orderId: string): Promise<CheckoutOrder | null> {
  try {
    const response = await fetch(buildBackendUrl(`/api/orders/${encodeURIComponent(orderId)}`), {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as CheckoutOrder;
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawOrderId = params.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
  const order = orderId ? await getOrder(orderId) : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_38%),linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="border-b border-gray-200/80 pb-6 mb-10">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gray-500 mb-3">Order confirmed</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">Your order is on its way</h1>
        </div>

        {order ? (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 sm:p-7 text-emerald-950 shadow-sm">
                <p className="font-semibold text-base sm:text-lg">Thanks, {order.customerName}. Your order has been placed.</p>
                <p className="mt-2 text-sm sm:text-[15px] leading-6 text-emerald-900/80">A confirmation email was sent to {order.customerEmail}.</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-black mb-5">Order details</h2>
                <div className="grid gap-4 text-sm text-gray-600 sm:grid-cols-2">
                  <div>
                    <span className="block text-gray-400">Order ID</span>
                    <span className="font-medium text-black">{order.id}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400">Status</span>
                    <span className="font-medium text-black">{order.status}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400">Payment status</span>
                    <span className="font-medium text-black">{order.paymentStatus}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-black mb-5">Items</h2>
                <div className="space-y-5">
                  {order.items.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex gap-4 items-start">
                      <div className="relative h-20 w-16 bg-gray-100 shrink-0 border border-gray-200">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.color} {item.size ? `/ ${item.size}` : ""}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Qty {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium text-black whitespace-nowrap">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-8 rounded-2xl bg-white/90 backdrop-blur border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-black mb-6 border-b border-gray-200 pb-4">Summary</h2>

                <div className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-200 pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-black">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-black">{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-bold text-black">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/products" className="bg-black text-white min-h-12 px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.18em] hover:bg-gray-900 transition-colors flex items-center justify-center">
                    Continue shopping
                  </Link>
                  <Link href="/" className="border border-gray-300 text-black min-h-12 px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.18em] hover:border-black transition-colors flex items-center justify-center">
                    Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-lg font-medium text-black">We could not load the order details.</p>
            <p className="mt-2 text-sm text-gray-600">The payment was confirmed, but the order ID was missing or could not be found.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/products" className="bg-black text-white min-h-12 px-6 text-sm font-bold uppercase tracking-[0.18em] hover:bg-gray-900 transition-colors flex items-center justify-center">
                Shop again
              </Link>
              <Link href="/checkout" className="border border-gray-300 text-black min-h-12 px-6 text-sm font-bold uppercase tracking-[0.18em] hover:border-black transition-colors flex items-center justify-center">
                Back to checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}