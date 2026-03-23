"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart, type CartItem } from "@/components/providers/CartProvider";

function money(value: number): string {
  return `₹${value.toFixed(2)}`;
}

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");

  const shipping = items.length === 0 ? 0 : subtotal >= 200 ? 0 : 12;
  const total = subtotal + shipping;

  async function handleCheckout() {
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items,
        }),
      });

      const data = (await response.json()) as { id?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to place order.");
      }

      setOrderId(data.id ?? "");
      setMessage("Order placed successfully.");
      setCustomerName("");
      setCustomerEmail("");
      clearCart();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to place order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
      <header className="mb-8 border-b border-neutral-200 pb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-500">Shopping Bag</p>
        <h1 className="font-heading text-4xl text-[#111111]">Cart</h1>
      </header>

      {items.length === 0 ? (
        <section className="border border-neutral-200 p-8 text-center">
          <p className="text-sm text-[#222222]">
            {orderId ? `Order ${orderId} has been placed.` : "Your cart is empty."}
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block border border-[#111111] px-6 py-3 text-xs uppercase tracking-[0.18em] text-[#111111] hover:bg-[#111111] hover:text-white"
          >
            Continue Shopping
          </Link>
        </section>
      ) : (
        <section className="grid gap-8 lg:grid-cols-[1fr,380px]">
          <div className="space-y-4">
            {items.map((item: CartItem) => (
              <article
                key={item.lineId}
                className="grid gap-4 border border-neutral-200 p-4 sm:grid-cols-[130px,1fr]"
              >
                <div className="relative aspect-[4/5] bg-neutral-100 sm:w-[130px]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex flex-col justify-between gap-3">
                  <div>
                    <h2 className="text-sm uppercase tracking-[0.12em] text-[#111111]">{item.name}</h2>
                    <p className="mt-1 text-sm text-[#222222]">{money(item.price)}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.12em] text-neutral-500">
                      Size: {item.size ?? "-"} | Color: {item.color ?? "-"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      className="border border-neutral-300 px-3 py-1 text-sm"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      className="border border-neutral-300 px-3 py-1 text-sm"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.lineId)}
                      className="ml-2 text-xs uppercase tracking-[0.12em] text-neutral-500 hover:text-[#111111]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit border border-neutral-200 p-6">
            <h2 className="mb-5 text-xs uppercase tracking-[0.2em] text-[#111111]">Order Summary</h2>
            <div className="flex items-center justify-between text-sm text-[#222222]">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-[#222222]">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : money(shipping)}</span>
            </div>
            <div className="mt-4 border-t border-neutral-200 pt-4">
              <div className="flex items-center justify-between text-base text-[#111111]">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Full name"
                className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]"
              />
              <input
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder="Email address"
                className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]"
              />
            </div>

            <button
              type="button"
              onClick={() => void handleCheckout()}
              disabled={submitting}
              className="mt-6 w-full border border-[#111111] bg-[#111111] py-3 text-xs uppercase tracking-[0.2em] text-white hover:bg-white hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Processing..." : "Proceed To Checkout"}
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full border border-neutral-300 py-3 text-xs uppercase tracking-[0.2em] text-[#222222] hover:border-[#111111]"
            >
              Clear Cart
            </button>

            {message ? <p className="mt-4 text-sm text-[#222222]">{message}</p> : null}
          </aside>
        </section>
      )}
    </main>
  );
}
