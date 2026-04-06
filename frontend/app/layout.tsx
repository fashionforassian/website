import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Playfair_Display } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/providers/CartProvider";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
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
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
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
            </CartProvider>
          </SmoothScrollProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
