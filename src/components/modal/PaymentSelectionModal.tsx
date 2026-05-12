import { X } from "lucide-react";

interface PaymentSelectionModalProps {
  onClose: () => void;
  onSelectPayment: (type: "QR" | "CASH") => void;
}

const PaymentSelectionModal = ({
  onClose,
  onSelectPayment,
}: PaymentSelectionModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-[480px] rounded-[32px] p-10 shadow-2xl overflow-hidden">
        {/* Close Button - Red Rounded Square */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-[#FF4D4D] text-white p-1 rounded-lg hover:bg-red-600 transition-colors shadow-md"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* Title */}
        <h2 className="text-2xl text-[#d18b47] text-center mb-10 font-khmer mt-4">
          ជ្រើសរើសការទូទាត់
        </h2>

        {/* Buttons Grid */}
        <div className="flex gap-4 items-stretch h-18 mb-5 ">
          <button
            onClick={() => onSelectPayment("QR")}
            className="flex-1 bg-[#FFD700] hover:bg-[#ffcf00] text-black font-khmer text-xl cursor-pointer rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center text-center p-4 leading-relaxed"
          >
            ទូទាត់តាមQR
          </button>

          <button
            onClick={() => onSelectPayment("CASH")}
            className="flex-1 bg-[#00E5FF] hover:bg-[#00d4eb] text-black font-khmer text-xl  cursor-pointer  rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center text-center p-4 leading-relaxed"
          >
            ទូទាត់លុយសុទ្ធ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelectionModal;
