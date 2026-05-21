import { useEffect } from "react";
import { X } from "lucide-react";

interface QRPaymentModalProps {
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const QRPaymentModal = ({ onClose, onPaymentSuccess }: QRPaymentModalProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onPaymentSuccess();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onPaymentSuccess]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-[400px] rounded-[40px] p-8 shadow-2xl flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-[#FF4D4D] text-white p-1 rounded-lg hover:bg-red-600 transition-colors shadow-md"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* Header Title */}
        <h2 className="text-3xl text-[#FF4D4D] font-khmer mb-6 mt-4">
          ទូទាត់តាម QR
        </h2>

        {/* KHQR Card Style */}
        <div className="w-full bg-[#1A2530] rounded-3xl overflow-hidden shadow-inner border border-gray-100">
          {/* Red KHQR Header */}
          <div className="bg-[#E11D48] py-3 px-6 flex justify-center">
            <span className="text-white font-bold tracking-widest text-xl">
              KHQR
            </span>
          </div>

          {/* Account Info */}
          <div className="p-6 text-center">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Sokleap Phorn
            </p>
            <p className="text-white text-3xl font-bold">0</p>

            {/* Divider Line */}
            <div className="border-t border-dashed border-gray-600 my-4"></div>

            {/* QR Code Placeholder/Image */}
            <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SamplePayment"
                alt="Payment QR"
                className="w-48 h-48"
              />
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-4 border-[#FF4D4D] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-khmer text-sm animate-pulse">
            កំពុងរង់ចាំការបង់ប្រាក់...
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRPaymentModal;
