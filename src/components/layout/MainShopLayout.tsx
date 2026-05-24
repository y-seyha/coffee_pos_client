"use client";

import Navbar from "../common/Navbar";
import CheckoutSidebar from "../client/Checkout/CheckoutSidebar";
import CategoryBar from "../common/CategoryBar";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MainShopLayout({
                                           children,
                                           onSearch,
                                           onCategory,
                                       }: any) {
    const [openCart, setOpenCart] = useState(false);

    const { summary } = useCart();

    useEffect(() => {
        document.documentElement.style.overflow = openCart ? "hidden" : "";
        document.body.style.overflow = openCart ? "hidden" : "";

        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        };
    }, [openCart]);

    return (
        <div className="h-screen flex flex-col bg-[#fafafa] overflow-hidden">

            {/* NAVBAR */}
            <Navbar onSearch={onSearch} />

            <div className="flex flex-1 overflow-hidden">

                {/* MAIN */}
                <main className="flex-1 flex flex-col overflow-hidden">

                    {/* CATEGORY */}
                    <div className="shrink-0 bg-white/70 backdrop-blur-md border-b">
                        <div className="max-w-[1200px] mx-auto px-4">
                            <CategoryBar onSelect={onCategory} />
                        </div>
                    </div>

                    {/* PRODUCTS */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                        <div className="max-w-[1200px] mx-auto py-4 space-y-6">
                            {children}
                        </div>
                    </div>

                </main>

                {/* DESKTOP CART */}
                <aside className="hidden lg:block w-[380px] border-l bg-white overflow-hidden">
                    <CheckoutSidebar />
                </aside>
            </div>

            <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%]">
                <button
                    onClick={() => setOpenCart(true)}
                    className="w-full flex items-center justify-between bg-[#d18b47] text-white px-5 py-3 rounded-full shadow-xl active:scale-95 transition"
                >
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={18} />
                        <span className="text-sm font-medium">View Cart</span>
                    </div>

                    <div className="text-sm font-bold">
                        ${summary?.grand_total?.toFixed(2) ?? "0.00"}
                    </div>
                </button>
            </div>

            <div
                className={`
                    fixed inset-0 z-50
                    pointer-events-none
                `}
            >

                {/* BACKDROP */}
                <div
                    onClick={() => setOpenCart(false)}
                    className={`
                        absolute inset-0 bg-black/50
                        transition-opacity duration-300
                        ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${openCart ? "opacity-100 pointer-events-auto" : "opacity-0"}
                    `}
                />

                {/* SHEET */}
                <div
                    className={`
                        absolute bottom-0 w-full max-h-[92dvh]
                        bg-white rounded-t-3xl flex flex-col shadow-2xl

                        transform-gpu will-change-transform

                        transition-transform duration-500
                        ease-[cubic-bezier(0.16,1,0.3,1)]

                        ${openCart
                        ? "translate-y-0 pointer-events-auto"
                        : "translate-y-full"
                    }
                    `}
                >

                    {/* HANDLE */}
                    <div className="py-2 flex justify-center">
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 overflow-y-auto">
                        <CheckoutSidebar mobile onClose={() => setOpenCart(false)} />
                    </div>

                </div>
            </div>

        </div>
    );
}