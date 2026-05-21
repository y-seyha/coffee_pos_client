"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

type NavbarProps = {
  onSearch?: (query: string) => void;
};

const Navbar = ({ onSearch }: NavbarProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // AUTO SEARCH (debounce)
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        await onSearch?.(query.trim());

      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // MANUAL SEARCH
  const handleSearch = async () => {
    try {
      setLoading(true);

      await onSearch?.(query.trim());

    } finally {
      setLoading(false);
    }
  };

  return (
      <nav className="flex items-center justify-between px-6 lg:px-8 py-4 bg-white border-b border-gray-100">

        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#43281c] rounded-full flex items-center justify-center">
            <div className="w-[2px] h-3 bg-white rotate-45 rounded-full" />
          </div>

          <span className="font-bold text-lg tracking-wider text-[#43281c]">
                    404&apos; CAFE.
                </span>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="ស្វែងរកភេសជ្ជៈ..."
              className="w-full text-black bg-[#fdf6ee] border border-[#e8d5c4] rounded-full py-2 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-[#cd8c52]/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
          />

          <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-1 top-1 bottom-1 px-4 bg-[#D5904B] text-white rounded-full flex items-center gap-1 hover:bg-[#b57a46] transition disabled:opacity-60 cursor-pointer"
          >
            <Search size={16} />

            <span className="text-xs font-khmer">
                        {loading ? "..." : "ស្វែងរក"}
                    </span>
          </button>
        </div>

        <div className="w-32 hidden md:block" />
      </nav>
  );
};

export default Navbar;