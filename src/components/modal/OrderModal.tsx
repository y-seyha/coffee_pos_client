import { useState } from "react";
import { X } from "lucide-react";

interface OrderModalProps {
  product: any;
  onClose: () => void;
  onConfirm: (order: any) => void;
}

const OrderModal = ({ product, onClose, onConfirm }: OrderModalProps) => {
  const [ice, setIce] = useState("ធម្មតា");
  const [sugar, setSugar] = useState("100%");
  const [size, setSize] = useState("S");

  if (!product) return null;

  const iceOptions = ["គីប", "ធម្មតា"];
  const sugarOptions = ["0%", "25%", "50%", "75%", "100%"];
  const sizeOptions = ["S", "M", "L"];

  const handleConfirm = () => {
    onConfirm({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: Number(product.price.replace("$", "")),
      options: {
        ice,
        sugar,
        size,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white w-full max-w-[420px] rounded-[24px] p-6 shadow-xl">
        {/* Close Button*/}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#FF4D4D] text-white p-1 rounded-lg hover:bg-red-600 transition-colors"
        >
          <X size={18} strokeWidth={3} />
        </button>

        {/* Header Section */}
        <div className="flex gap-4 items-center mb-8">
          <div className="w-28 h-28 bg-[#F7F7F7] rounded-2xl flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-contain"
            />
          </div>

          <div className="ml-10 flex-1">
            <h2 className="text-xl font-bold text-[#333] mb-1">
              {product.name}
            </h2>
            <div className="space-y-1">
              <p className="text-[15px] font-medium text-[#444]">
                តម្លៃ ៖ {product.price || "1$"}
              </p>
              <p className="text-[15px] font-medium text-[#FF6B6B]">
                បញ្ចុះតម្លៃ ៖ {product.discount || "0.00%"}
              </p>
            </div>
          </div>
        </div>

        {/* Selection Rows */}
        <div className="space-y-5">
          {/* ICE */}
          <div className="flex items-center">
            <label className="w-16 text-[15px] font-bold text-[#333]">
              ទឹកកក
            </label>
            <div className="flex-1 flex bg-white border border-gray-200 p-0.5 rounded-full overflow-hidden">
              {iceOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setIce(opt)}
                  className={`flex-1 py-1.5 px-3 rounded-full text-sm font-medium transition-all ${
                    ice === opt
                      ? "bg-[#D5904B] text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* SUGAR */}
          <div className="flex items-center">
            <label className="w-16 text-[15px] font-bold text-[#333]">
              ស្ករ
            </label>
            <div className="flex-1 flex bg-white border border-gray-200 p-0.5 rounded-full overflow-hidden">
              {sugarOptions.map((v) => (
                <button
                  key={v}
                  onClick={() => setSugar(v)}
                  className={`flex-1 py-1.5 text-[13px] font-medium rounded-full transition-all ${
                    sugar === v
                      ? "bg-[#D5904B] text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div className="flex items-center">
            <label className="w-16 text-[15px] font-bold text-[#333]">
              ទំហំ
            </label>
            <div className="flex-1 flex bg-white border border-gray-200 p-0.5 rounded-full overflow-hidden">
              {sizeOptions.map((v) => (
                <button
                  key={v}
                  onClick={() => setSize(v)}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-full transition-all ${
                    size === v
                      ? "bg-[#D5904B] text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ORDER BUTTON */}
        <button
          onClick={handleConfirm}
          className="w-full h-10 mt-10 rounded-xl bg-[#D5904B] text-white text-lg font-bold flex items-center justify-center hover:bg-[#c07e3e] active:scale-[0.98] transition-all shadow-md"
        >
          កម្មង់
        </button>
      </div>
    </div>
  );
};

export default OrderModal;
