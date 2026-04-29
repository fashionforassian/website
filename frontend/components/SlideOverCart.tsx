"use client";

import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function SlideOverCart() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl transition-transform flex flex-col h-full animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-black tracking-tight">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <p className="text-gray-500">Your cart is currently empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-gray-900 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.lineId} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <Link href={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)} className="shrink-0">
                    <div className="relative h-32 w-24 overflow-hidden bg-gray-50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-black">
                          <Link href={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)}>
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-sm font-medium text-black ml-4">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.color} {item.size && ` / ${item.size}`}
                      </p>
                    </div>

                    <div className="flex items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-300 rounded-none">
                        <button
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          className="px-3 py-1 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-medium text-black min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          className="px-3 py-1 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.lineId)}
                        className="text-xs font-medium text-gray-400 hover:text-red-600 underline underline-offset-2 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-6 bg-gray-50/50">
            <div className="flex justify-between text-base font-medium text-black mb-4">
              <p>Subtotal</p>
              <p>{formatPrice(subtotal)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="flex w-full items-center justify-center bg-black px-6 py-4 text-sm font-medium tracking-widest uppercase text-white hover:bg-gray-900 transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
