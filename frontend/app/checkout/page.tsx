"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/data";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const shippingCost = shippingMethod === "express" ? 15 : 0;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight mb-4">Checkout is unavailable</h1>
          <p className="text-gray-500 mb-8">Your cart is empty.</p>
          <Link href="/products" className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-900">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-black mb-12 border-b border-gray-200 pb-6">Checkout</h1>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Express Checkout */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-6 text-center">Express Checkout</h2>
              <div className="flex gap-4 justify-center">
                <button className="flex-1 bg-black text-white h-12 flex items-center justify-center rounded-sm hover:opacity-90">
                  <span className="font-semibold">Pay</span>
                </button>
                <button className="flex-1 bg-[#FFC439] text-black h-12 flex items-center justify-center rounded-sm hover:opacity-90 font-bold italic">
                  PayPal
                </button>
              </div>
              <div className="relative flex items-center py-8">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-gray-400 uppercase tracking-widest">Or continue below</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>

            {/* Contact & Shipping */}
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div>
                <h2 className="text-lg font-medium text-black mb-6">Contact</h2>
                <input type="email" placeholder="Email or mobile phone number" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors" />
              </div>

              <div>
                <h2 className="text-lg font-medium text-black mb-6">Delivery</h2>
                <div className="space-y-4">
                  <select className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white appearance-none">
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First name" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors" />
                    <input type="text" placeholder="Last name" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors" />
                  </div>
                  
                  <input type="text" placeholder="Address" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors" />
                  <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors" />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="City" className="col-span-1 w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors" />
                    <input type="text" placeholder="State" className="col-span-1 w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors" />
                    <input type="text" placeholder="ZIP code" className="col-span-1 w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black transition-colors" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-black mb-6">Shipping method</h2>
                <div className="border border-gray-300 rounded-sm">
                  <label className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={shippingMethod === "standard"} onChange={() => setShippingMethod("standard")} className="w-4 h-4 text-black accent-black" />
                      <span className="text-sm">Standard Shipping (3-5 business days)</span>
                    </div>
                    <span className="text-sm font-medium">Free</span>
                  </label>
                  <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={shippingMethod === "express"} onChange={() => setShippingMethod("express")} className="w-4 h-4 text-black accent-black" />
                      <span className="text-sm">Express Shipping (1-2 business days)</span>
                    </div>
                    <span className="text-sm font-medium">$15.00</span>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-black mb-6">Payment</h2>
                <div className="border border-gray-300 p-6 text-center text-gray-500 text-sm bg-gray-50">
                  This is a demonstration checkout. No real payments are processed.
                </div>
              </div>

              <button type="submit" className="w-full bg-black text-white h-14 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors mt-8">
                Pay Now
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
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
