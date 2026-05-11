import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 lg:px-8 py-4 bg-white border-b border-gray-100">
      {/* Branding */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#43281c] rounded-full flex items-center justify-center">
          <div className="w-[2px] h-3 bg-white rotate-45 rounded-full"></div>
        </div>
        <span className="font-bold text-lg tracking-wider text-[#43281c]">
          404' CAFE.
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="ស្វែងរកភេសជ្ជៈ ឬ អាហារសម្រន់ផ្សេងៗ..."
          className="w-full text-black bg-[#fdf6ee] border border-[#e8d5c4] rounded-full py-2 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-[#cd8c52]/20 font-khmer text-sm"
        />
        <button className="absolute right-1 top-1 bottom-1 px-4 bg-[#D5904B] text-white rounded-full flex items-center gap-1 hover:bg-[#b57a46] transition-colors">
          <Search size={16} />
          <span className="text-xs font-khmer">ស្វែងរក</span>
        </button>
      </div>

      {/* Empty space for balance or User Profile */}
      <div className="w-32 hidden md:block"></div>
    </nav>
  );
};

export default Navbar;
