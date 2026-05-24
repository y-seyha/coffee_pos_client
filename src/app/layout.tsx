import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coffee POS",
  description: "Coffee POS",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} h-dvh antialiased`}
      >
      <body className="h-dvh overflow-hidden">
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </AuthProvider>
      </body>
      </html>
  );
}