import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/providers/CartProvider";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import SlideOverCart from "@/components/SlideOverCart";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fassion 4 Asian",
  description: "Modern fast-fashion editorial commerce experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <ClerkProvider
          signInFallbackRedirectUrl="/"
          signInForceRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
          signUpForceRedirectUrl="/"
        >
          <SmoothScrollProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <SlideOverCart />
            </CartProvider>
          </SmoothScrollProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
