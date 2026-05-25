"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { buildBackendUrl } from "@/lib/backend-api";
import { formatPrice } from "@/lib/data";

type CheckoutFormState = {
  customerName: string;
  customerEmail: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type RazorpayCheckoutResponse = {
  keyId: string;
  sessionId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  subtotal: number;
  shipping: number;
  total: number;
};

type RazorpaySuccessPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: { error?: { description?: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  // single shipping method: standard
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"neutral" | "success" | "error">("neutral");
  const [form, setForm] = useState<CheckoutFormState>({
    customerName: "",
    customerEmail: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const shippingCost = 0;
  const total = subtotal + shippingCost;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      setMessage("");
      setMessageTone("neutral");
    }
  }, [items.length]);

  function updateField(field: keyof CheckoutFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function confirmPayment(payload: RazorpaySuccessPayload) {
    const response = await fetch(buildBackendUrl("/api/orders/confirm"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpayOrderId: payload.razorpay_order_id,
        razorpayPaymentId: payload.razorpay_payment_id,
        razorpaySignature: payload.razorpay_signature,
      }),
    });

    const data = (await response.json()) as { id?: string; message?: string };

    if (!response.ok) {
      throw new Error(data.message || "Unable to confirm payment.");
    }

    return data;
  }

  async function handlePlaceOrder() {
    if (!items.length) {
      return;
    }

    if (!form.customerName.trim() || !form.customerEmail.trim()) {
      setMessage("Customer name and email are required.");
      setMessageTone("error");
      return;
    }

    if (!form.addressLine1.trim() || !form.city.trim() || !form.state.trim() || !form.postalCode.trim()) {
      setMessage("Please complete the shipping address.");
      setMessageTone("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setMessageTone("neutral");

    try {
      const response = await fetch(buildBackendUrl("/api/checkout/razorpay/order"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          phone: form.phone,
          items,
          shippingMethod: "standard",
          shippingAddress: {
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
            phone: form.phone,
          },
        }),
      });

      const payload = (await response.json()) as RazorpayCheckoutResponse & { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Unable to start payment.");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay checkout.");
      }

      const razorpay = new window.Razorpay({
        key: payload.keyId,
        amount: payload.amount,
        currency: payload.currency,
        name: "Fassion 4 Asian",
        description: "Order payment",
        order_id: payload.razorpayOrderId,
        prefill: {
          name: form.customerName,
          email: form.customerEmail,
          contact: form.phone,
        },
        theme: {
          color: "#111111",
        },
        handler: async (paymentResponse: RazorpaySuccessPayload) => {
          try {
            const createdOrder = await confirmPayment(paymentResponse);
            if (!createdOrder.id) {
              throw new Error("Payment succeeded, but the order confirmation response was incomplete.");
            }
            clearCart();
            router.replace(`/checkout/success?orderId=${encodeURIComponent(createdOrder.id)}`);
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Payment confirmation failed.");
            setMessageTone("error");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      });

      razorpay.on("payment.failed", (paymentError) => {
        setMessage(paymentError.error?.description || "Payment failed. Please try again.");
        setMessageTone("error");
        setIsSubmitting(false);
      });

      razorpay.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start payment.");
      setMessageTone("error");
    }
  }

  // Avoid rendering cart-dependent UI on the server to prevent hydration mismatches.
  // Render a neutral placeholder both on server and initial client render,
  // then show the full checkout UI after the component mounts on the client.
  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-black mb-12 border-b border-gray-200 pb-6">Checkout</h1>

        {message ? (
          <div
            className={`mb-8 rounded-sm border px-4 py-3 text-sm ${
              messageTone === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : messageTone === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-neutral-200 bg-neutral-50 text-neutral-700"
            }`}
          >
            {message}
          </div>
        ) : null}

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-7 space-y-12">
            {/* Express checkout removed */}

            <form
              className="space-y-10"
              onSubmit={(event) => {
                event.preventDefault();
                void handlePlaceOrder();
              }}
            >
              <div>
                <h2 className="text-lg font-medium text-black mb-6">Contact</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={form.customerName}
                    onChange={(event) => updateField("customerName", event.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.customerEmail}
                    onChange={(event) => updateField("customerEmail", event.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="mt-4 w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <h2 className="text-lg font-medium text-black mb-6">Delivery</h2>
                <div className="space-y-4">
                  <select className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white appearance-none" value={form.country} onChange={(event) => updateField("country", event.target.value)}>
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Address"
                    value={form.addressLine1}
                    onChange={(event) => updateField("addressLine1", event.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={form.addressLine2}
                    onChange={(event) => updateField("addressLine2", event.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={form.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      className="col-span-1 w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={form.state}
                      onChange={(event) => updateField("state", event.target.value)}
                      className="col-span-1 w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="ZIP code"
                      value={form.postalCode}
                      onChange={(event) => updateField("postalCode", event.target.value)}
                      className="col-span-1 w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-black mb-6">Shipping method</h2>
                <div className="border border-gray-300 rounded-sm">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 inline-block rounded-full border border-neutral-300 bg-white" />
                      <span className="text-sm">Standard Shipping (3-5 business days)</span>
                    </div>
                    <span className="text-sm font-medium">Free</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-black mb-6">Payment</h2>
                {/* Payment provider information removed per request */}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white h-14 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors mt-8 disabled:cursor-not-allowed disabled:bg-gray-400">
                {isSubmitting ? "Starting Payment..." : "Pay Now"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="sticky top-8 bg-gray-50 p-8 border border-gray-100">
              <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-6 border-b border-gray-200 pb-4">Order Summary</h2>

              <div className="space-y-4 mb-6 border-b border-gray-200 pb-6 max-h-[40vh] overflow-y-auto pr-2 hide-scrollbar">
                {items.map((item) => (
                  <div key={item.lineId} className="flex gap-4">
                    <div className="relative h-20 w-16 bg-gray-100 shrink-0 border border-gray-200">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium z-10">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-medium text-black leading-tight mb-1">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.color} {item.size && `/ ${item.size}`}</p>
                    </div>
                    <div className="text-sm font-medium text-black flex items-center">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

                <div className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-200 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-black">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="font-medium text-black">{formatPrice(0)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Payment</span>
                  <span>Razorpay</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-black">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
