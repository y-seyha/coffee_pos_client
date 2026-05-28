import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentSelectionModalProps {
  onClose: () => void;
  onSelectPayment: (type: "KHQR" | "CASH") => void;
}

const PaymentSelectionModal = ({
                                 onClose,
                                 onSelectPayment,
                               }: PaymentSelectionModalProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 200);
  };

  return (
      <div
          className={`fixed inset-0 flex items-center justify-center z-[60] p-4 backdrop-blur-sm transition-all duration-200 ${
              show ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0"
          }`}
      >
        <div
            className={`relative bg-white w-full max-w-[480px] rounded-[32px] p-10 shadow-2xl overflow-hidden transform transition-all duration-300 ${
                show
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-10 scale-95"
            }`}
        >
          {/* Close Button - KEEP COLOR */}
          <button
              onClick={handleClose}
              className="absolute top-5 right-5 bg-[#FF4D4D] text-white p-1 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
          >
            <X size={20} strokeWidth={3} />
          </button>

          {/* Title - unchanged */}
          <h2 className="text-2xl text-[#d18b47] text-center mb-10 font-khmer mt-4">
            ជ្រើសរើសការទូទាត់
          </h2>

          {/* Buttons */}
          <div className="flex gap-4 items-stretch h-18 mb-5">
            <button
                onClick={() => onSelectPayment("KHQR")}
                className="flex-1 bg-[#FFD700] hover:bg-[#ffcf00] text-black font-khmer text-xl cursor-pointer rounded-2xl shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-95 flex items-center justify-center text-center p-4 leading-relaxed"
            >
              ទូទាត់តាមQR
            </button>

            <button
                onClick={() => onSelectPayment("CASH")}
                className="flex-1 bg-[#00E5FF] hover:bg-[#00d4eb] text-black font-khmer text-xl cursor-pointer rounded-2xl shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-95 flex items-center justify-center text-center p-4 leading-relaxed"
            >
              ទូទាត់លុយសុទ្ធ
            </button>
          </div>
        </div>
      </div>
  );
};

export default PaymentSelectionModal;