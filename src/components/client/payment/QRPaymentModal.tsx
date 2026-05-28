import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {useCart} from "@/context/CartContext";
import {CheckoutApiResponse} from "@/types";

interface QRPaymentModalProps {
  onClose: () => void;
  onPaymentSuccess: () => void;
  order: CheckoutApiResponse["order"];
}

const QRPaymentModal = ({
                          onClose,
                          onPaymentSuccess,
                          order,
                        }: QRPaymentModalProps) => {
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show]);

  useEffect(() => {
    setShow(true);
    setTimeLeft(10);

    const timer = setTimeout(() => {
      onPaymentSuccess();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onPaymentSuccess]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 200);
  };

  return (
      <div
          className={`fixed inset-0 flex items-center justify-center z-[70] p-4 backdrop-blur-sm transition-all duration-200 ${
              show ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0"
          }`}
      >
        <div
            className={`relative bg-white w-full max-w-[400px] rounded-[40px] p-8 shadow-2xl flex flex-col items-center transform transition-all duration-300 ${
                show
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-10 scale-95"
            }`}
        >
          {/* Close Button (UNCHANGED COLOR) */}
          <button
              onClick={handleClose}
              className="absolute top-5 right-5 bg-[#FF4D4D] text-white p-1 rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
          >
            <X size={20} strokeWidth={3} />
          </button>

          {/* Header Title */}
          <h2 className="text-3xl text-[#FF4D4D] font-khmer mb-6 mt-4">
            ទូទាត់តាម QR
          </h2>

          {/* KHQR Card */}
          <div className="w-full bg-[#1A2530] rounded-3xl overflow-hidden shadow-inner border border-gray-100 transition-all duration-200 hover:shadow-lg">
            {/* Header */}
            <div className="bg-[#E11D48] py-3 px-6 flex justify-center">
            <span className="text-white font-bold tracking-widest text-xl">
              KHQR
            </span>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              {/* POS LABEL (replaced name) */}
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Coffee POS System
              </p>

              <p className="text-white text-3xl font-bold">
                ${Number(order?.grand_total ?? 0).toFixed(2)}
              </p>
              {/* Divider */}
              <div className="border-t border-dashed border-gray-600 my-4"></div>

              {/* QR */}
              <div className="bg-white p-4 rounded-xl inline-block shadow-lg transition-transform duration-200 hover:scale-[1.02]">
                <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SamplePayment"
                    alt="Payment QR"
                    className="w-48 h-48"
                />
              </div>
            </div>
          </div>

          {/* Loading */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-4 border-[#FF4D4D] border-t-transparent rounded-full animate-spin"></div>

            <p className="text-gray-500 font-khmer text-sm animate-pulse">
              កំពុងរង់ចាំការបង់ប្រាក់...
            </p>

            <p className="text-xs text-gray-400 mt-1">
              សល់ពេល: <span className="font-bold text-[#FF4D4D]">{timeLeft}s</span>
            </p>
          </div>
        </div>
      </div>
  );
};

export default QRPaymentModal;