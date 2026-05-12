
import { Check } from "lucide-react";
import { CartItem } from "@/context/CartContext";

interface SuccessModalProps {
  items: CartItem[];
  totalPrice: number;
  paymentMethod: "QR" | "CASH";
  onClose: () => void;
}

const PaymentSuccessModal = ({
  items,
  totalPrice,
  paymentMethod,
  onClose,
}: SuccessModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative bg-[#C1F1A6] w-full max-w-[540px] rounded-[40px] p-8 md:p-12 flex flex-col items-center shadow-2xl animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-[#338A00] rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Check size={60} className="text-white" strokeWidth={4} />
        </div>

        {/* Success Title */}
        <h2 className="text-2xl md:text-3xl text-[#338A00] font-bold font-khmer mb-8 text-center leading-tight">
          ការទូទាត់ទទួលបានជោគជ័យ
        </h2>

        {/* Receipt Container */}
        <div className="bg-white w-full rounded-[32px] p-6 md:p-8 shadow-sm relative overflow-hidden">
          {/* Receipt Header */}
          <div className="flex justify-between text-[13px] text-gray-400 font-bold mb-4">
            <span>Order #0001</span>
            <span>Order #0001</span>
          </div>

          {/* Item List */}
          <div className="space-y-3 mb-6 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-gray-600"
              >
                <span className="text-base font-medium">{item.name}</span>
                <span className="text-base font-bold">x{item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 border-dashed my-5"></div>

          {/* Totals */}
          <div className="space-y-2.5 text-gray-500">
            <div className="flex justify-between text-[15px]">
              <span>បញ្ចុះតម្លៃ</span>
              <span className="font-bold text-gray-700">0.00$</span>
            </div>
            <div className="flex justify-between text-[15px]">
              <span>តម្លៃសរុប</span>
              <span className="font-bold text-gray-700">
                {totalPrice.toFixed(2)}$
              </span>
            </div>
            <div className="flex justify-between text-[15px]">
              <span>ទូទាត់តាម</span>
              <span className="font-bold text-gray-700">
                {paymentMethod === "QR" ? "QR Code" : "លុយសុទ្ធ"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-xl md:text-2xl text-[#338A00] font-bold font-khmer mt-10 text-center">
          សូមអរគុណសម្រាប់ការគាំទ្រ🙏
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
