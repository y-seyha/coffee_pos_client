"use client";

import { useState } from "react";
import { CATEGORIES } from "@/helper";

interface Props {
  onSelect?: (categoryId: string | number) => void;
}

const CategoryBar = ({ onSelect }: Props) => {
  const [active, setActive] = useState("all");

  const handleClick = (cat: any) => {
    setActive(cat.id);
    onSelect?.(cat.id);
  };

  return (
      <div className="sticky z-40 bg-white/70 backdrop-blur-md">

        <div className="flex flex-wrap gap-3 py-6">
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