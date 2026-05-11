const CartItem = () => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
    {/* Product Image */}
    <div className="w-20 h-20 bg-[#f8f8f8] rounded-[18px] overflow-hidden flex items-center justify-center shrink-0">
      <img src="/coffee_cup.png" className="w-[72%] h-[72%] object-contain" />
    </div>

    {/* Product Info */}
    <div className="flex-1 min-w-0">
      <h4 className="text-[15px] font-semibold text-black truncate">
        អាយអាយស្កូកាណូ
      </h4>

      <p className="text-sm text-gray-400 truncate">Iced Americano</p>

      <div className="flex justify-between items-center mt-3">
        <span className="text-[#cd8c52] font-bold text-[16px]">3.00$</span>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
            -
          </button>

          <span className="text-sm font-bold text-black">3</span>

          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
            +
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CheckoutSidebar = () => {
  return (
    <aside className="w-full lg:w-[400px] bg-white h-full border-l border-gray-100 p-6 lg:p-8 flex flex-col">
      <h2 className="text-2xl font-bold text-[#d18b47] font-khmer text-center mb-8">
        ការទូទាត់ប្រាក់
      </h2>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        <CartItem />
        <CartItem />
        <CartItem />
      </div>

      <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-3">
        <div className="flex justify-between text-sm text-gray-400">
          <span>តម្លៃ</span>
          <span>9.00$</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>បញ្ចុះតម្លៃ</span>
          <span className="text-yellow-500">0.00$</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-[#cd8c52] pt-2">
          <span>តម្លៃសរុប</span>
          <span>9.00$</span>
        </div>
        <button className="w-full py-4 bg-[#7487ff] text-white rounded-2xl font-bold mt-4 shadow-lg shadow-blue-100 hover:opacity-90 transition-opacity">
          ទូទាត់
        </button>
      </div>
    </aside>
  );
};

export default CheckoutSidebar;
