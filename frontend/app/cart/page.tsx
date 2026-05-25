"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/data";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-360 mx-auto px-4 py-32 sm:px-6 lg:px-8 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-black mb-6">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" className="bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-360 mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold uppercase tracking-tight text-black mb-12">Shopping Cart</h1>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="hidden sm:grid grid-cols-6 gap-4 border-b border-gray-200 pb-4 mb-6 text-xs font-bold uppercase tracking-widest text-gray-500">
            <div className="col-span-3">Product</div>
            <div className="col-span-1 text-center">Quantity</div>
            <div className="col-span-1 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-8 sm:space-y-6">
            {items.map((item) => (
              <div key={item.lineId} className="flex flex-col sm:grid sm:grid-cols-6 gap-4 items-center sm:items-center border-b border-gray-100 pb-8 sm:pb-6 last:border-0">
                <div className="col-span-3 flex w-full gap-4">
                  <Link href={`/product/${item.slug}`} className="shrink-0">
                    <div className="relative h-32 w-24 sm:h-40 sm:w-32 overflow-hidden bg-gray-50">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  </Link>
                  <div className="flex flex-col justify-center">
                    <Link href={`/product/${item.slug}`} className="text-sm font-medium text-black hover:text-gray-500 mb-1">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">{formatPrice(item.price)}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">
                      {item.color} {item.size && `| ${item.size}`}
                    </p>
                  </div>
                </div>

                <div className="col-span-1 flex justify-start sm:justify-center w-full mt-4 sm:mt-0">
                  <div className="flex items-center border border-gray-300">
                    <button onClick={() => updateQuantity(item.lineId, item.quantity - 1)} className="px-3 py-1 sm:py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors" disabled={item.quantity <= 1}>-</button>
                    <span className="px-2 sm:px-4 py-1 sm:py-2 text-sm font-medium text-black min-w-[2.5rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.lineId, item.quantity + 1)} className="px-3 py-1 sm:py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">+</button>
                  </div>
                </div>

                <div className="col-span-1 text-left sm:text-right w-full font-medium text-black text-sm mt-2 sm:mt-0">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <div className="col-span-1 text-right w-full sm:w-auto mt-2 sm:mt-0">
                  <button onClick={() => removeFromCart(item.lineId)} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600 pb-0.5">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-gray-50 p-8 border border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-6 border-b border-gray-200 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between text-base font-bold text-black mb-8">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <Link href="/checkout" className="block w-full text-center bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
