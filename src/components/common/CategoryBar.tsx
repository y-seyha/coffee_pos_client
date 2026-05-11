"use client";

import { useState } from "react";

export const CATEGORIES = [
  { id: "all", name: "ទាំងអស់" },
  { id: 1, name: "លក់ដាច់បំផុត" },
  { id: 2, name: "ប្រភេទកាហ្វេ" },
  { id: 3, name: "ប្រភេទត្រជាក់" },
  { id: 4, name: "ប្រភេទក្តៅៗ" },
  { id: 5, name: "ប្រភេទអាហារសម្រន់" },
];

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
  );
};

export default CategoryBar;
