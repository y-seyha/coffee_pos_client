const categories = [
  "ទាំងអស់",
  "លក់ដាច់បំផុត",
  "ប្រភេទកាហ្វេ",
  "ប្រភេទត្រជាក់",
  "ប្រភេទក្តៅៗ",
  "ប្រភេទអាហារសម្រន់",
];

const CategoryBar = () => {
  return (
    <div className="flex flex-wrap gap-3 py-6">
      {categories.map((cat, index) => (
        <button
          key={cat}
          className={`px-6 py-2 text-black rounded-full text-sm font-khmer transition-all border ${
            index === 0
              ? "bg-[#D5904B] text-white border-[#cd8c52]"
              : "bg-white text-[#8a5d3b] border-[#D5904B] hover:bg-[#fdf6ee]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
