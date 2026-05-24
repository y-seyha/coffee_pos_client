"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

type NavbarProps = {
    onSearch?: (query: string) => void;
};

const Navbar = ({ onSearch }: NavbarProps) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const lastSentRef = useRef("");

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

            {/* SEARCH */}
            <div className="flex-1 max-w-[220px] sm:max-w-md md:max-w-lg lg:max-w-xl relative">

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="ស្វែងរកភេសជ្ជៈ..."
                    className="w-full text-black bg-[#fdf6ee] border border-[#e8d5c4] rounded-full
                    py-2 px-4 sm:px-6 pr-5
                    focus:outline-none focus:ring-2 focus:ring-[#cd8c52]/20 text-sm sm:text-base"
                />

                {/* CLEAR BUTTON */}
                {query && (
                    <button
                        onClick={handleClear}
                        className="
    absolute
    right-11 sm:right-25 md:right-25
    top-1/2 -translate-y-1/2
    text-gray-500 hover:text-black
    z-10
"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* SEARCH BUTTON */}
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="
                        absolute right-1 top-1 bottom-1
                        px-3 sm:px-4
                        bg-[#D5904B] text-white
                        rounded-full flex items-center gap-1
                        hover:bg-[#b57a46] transition
                        disabled:opacity-60
                    "
                >
                    <Search size={16} />
                    <span className="text-xs font-khmer hidden sm:inline">
                        {loading ? "..." : "ស្វែងរក"}
                    </span>
                </button>

            </div>

            {/* SPACER */}
            <div className="hidden md:block w-20 lg:w-32" />
        </nav>
    );
};

export default Navbar;