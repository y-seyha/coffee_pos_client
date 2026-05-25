"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type NavbarProps = {
    onSearch?: (query: string) => void;
};

const Navbar = ({ onSearch }: NavbarProps) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const lastSentRef = useRef("");

    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            const trimmed = query.trim();

            if (trimmed === lastSentRef.current) return;

            lastSentRef.current = trimmed;
            onSearch?.(trimmed);
        }, 400);

        return () => clearTimeout(timeout);
    }, [query, onSearch]);

    const handleSearch = async () => {
        const trimmed = query.trim();
        lastSentRef.current = trimmed;

        setLoading(true);
        try {
            onSearch?.(trimmed);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuery("");
        lastSentRef.current = "";
        onSearch?.("");
    };

    const isAdmin = user?.role === "ADMIN";

    return (
        <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white border-b border-gray-100 gap-3 sm:gap-6">

            {/* BRAND */}
            <div className="flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#43281c] rounded-full flex items-center justify-center">
                    <div className="w-[2px] h-3 bg-white rotate-45 rounded-full" />
                </div>

                <span className="font-bold text-sm sm:text-base lg:text-lg tracking-wider text-[#43281c] whitespace-nowrap">
                    404&apos; CAFE.
                </span>
            </div>

            <div className="flex-1 min-w-0 max-w-[220px] sm:max-w-md md:max-w-lg lg:max-w-xl relative">

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="ស្វែងរកភេសជ្ជៈ..."
                    className="w-full text-black bg-[#fdf6ee] border border-[#e8d5c4] rounded-full
                    py-2 px-4 sm:px-6 pr-5
                    focus:outline-none focus:ring-2 focus:ring-[#cd8c52]/20 text-sm sm:text-base"
                />

                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-11 sm:right-25 md:right-25 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        <X size={16} />
                    </button>
                )}

                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="absolute right-1 top-1 bottom-1 px-3 sm:px-4 bg-[#D5904B] text-white rounded-full flex items-center gap-1"
                >
                    <Search size={16} />
                    <span className="text-xs font-khmer hidden sm:inline">
                        {loading ? "..." : "ស្វែងរក"}
                    </span>
                </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">

                {/* ADMIN BUTTON */}
                {isAdmin && (
                    <button
                        onClick={() => router.push("/admin")}
                        className="
        group relative inline-flex items-center gap-2
        px-4 sm:px-5 py-2 sm:py-2.5
        rounded-full
        bg-gradient-to-r from-[#D5904B] to-[#c77f3f]
        text-white text-xs sm:text-sm font-semibold
        shadow-md hover:shadow-lg
        transition-all duration-200
        active:scale-95
        hover:brightness-110
        whitespace-nowrap
        overflow-hidden
    "
                    >
                        {/* subtle shine effect */}
                        <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition" />

                        <span className="relative">
        <span className="hidden sm:inline">Admin Dashboard</span>
        <span className="sm:hidden">Dashboard</span>
    </span>
                    </button>
                )}

            </div>

        </nav>
    );
};

export default Navbar;