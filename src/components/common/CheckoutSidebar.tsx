const CartItem = () => (
  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-50">
    <div className="w-16 h-16 bg-[#f9f9f9] rounded-xl overflow-hidden">
      <img src="/iced-coffee.png" className="w-full h-full object-cover" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium">អាយអាយស្កូកាណូ</h4>
      <p className="text-xs text-gray-400">Iced Americano</p>
      <div className="flex justify-between items-center mt-1">
        <span className="text-[#cd8c52] font-bold text-sm">3.00$</span>
        <div className="flex items-center gap-2">
          <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
            -
          </button>
          <span className="text-sm font-bold">3</span>
          <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
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
      <h2 className="text-2xl font-bold text-[#cd8c52] font-khmer text-center mb-8">
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
