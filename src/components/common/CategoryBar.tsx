"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/helper";

interface Props {
    onSelect?: (categoryId: string | number) => void;
}

const CategoryBar = ({ onSelect }: Props) => {
    const [active, setActive] = useState("all");
    const [open, setOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClick = (cat: any) => {
        setActive(cat.id);
        onSelect?.(cat.id);
        setOpen(false);
    };

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
        <div
            ref={containerRef}
            className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-100"
        >
            {/* MOBILE HEADER */}
            <div className="flex md:hidden items-center justify-between px-4 py-3">
        <span className="text-sm font-khmer text-[#43281c]">
          Categories
        </span>

                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="p-2 rounded-md border border-[#D5904B] text-[#D5904B] transition-transform duration-300 active:scale-90"
                >
                    <div className="relative w-[18px] h-[18px]">
                        <Menu
                            size={18}
                            className={`absolute transition-all duration-300 ${
                                open ? "opacity-0 rotate-90 scale-75" : "opacity-100"
                            }`}
                        />

                        <X
                            size={18}
                            className={`absolute transition-all duration-300 ${
                                open ? "opacity-100" : "opacity-0 -rotate-90 scale-75"
                            }`}
                        />
                    </div>
                </button>
            </div>

            {/* MOBILE DROPDOWN */}
            <div
                className={`md:hidden px-4 pb-4 flex flex-col gap-2 overflow-hidden transition-all duration-300 ease-in-out
        ${
                    open
                        ? "max-h-[400px] opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
                }
      `}
            >
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleClick(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-khmer border transition-all text-left
              ${
                            active === cat.id
                                ? "bg-[#D5904B] text-white border-[#cd8c52]"
                                : "bg-white text-[#8a5d3b] border-[#D5904B] hover:bg-[#fdf6ee]"
                        }
            `}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* DESKTOP */}
            <div className="hidden md:flex flex-wrap gap-3 py-5 px-6 lg:px-8">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleClick(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-khmer border transition-all
              ${
                            active === cat.id
                                ? "bg-[#D5904B] text-white border-[#cd8c52]"
                                : "bg-white text-[#8a5d3b] border-[#D5904B] hover:bg-[#fdf6ee]"
                        }
            `}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;