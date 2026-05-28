import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { CheckoutApiResponse } from "@/types";

interface SuccessModalProps {
  order: CheckoutApiResponse["order"];
  onClose: () => void;
}

const PaymentSuccessModal = ({ order, onClose }: SuccessModalProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);

    // prevent background scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 200);
  };

  const items = order?.items ?? [];
  const format = (v: any) => Number(v ?? 0).toFixed(2);

  return (
      <div
          className={`fixed inset-0 flex items-center justify-center z-[70] p-4 backdrop-blur-sm transition-all duration-200 ${
              show ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0"
          }`}
          onClick={handleClose}
      >
        <div
            className={`relative bg-[#C1F1A6] w-full max-w-[540px] rounded-[40px] p-8 md:p-12 flex flex-col items-center shadow-2xl transform transition-all duration-300 ${
                show
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-10 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
        >
          {/* ICON */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-[#338A00] rounded-full flex items-center justify-center mb-6 shadow-lg transition-transform duration-200 hover:scale-105">
            <Check size={60} className="text-white" strokeWidth={4} />
          </div>

          {/* TITLE */}
          <h2 className="text-2xl md:text-3xl text-[#338A00] font-bold font-khmer mb-8 text-center">
            ការទូទាត់ទទួលបានជោគជ័យ
          </h2>

          {/* RECEIPT */}
          <div className="bg-white w-full rounded-[32px] p-6 md:p-8 shadow-sm transition-all duration-200 hover:shadow-md">
            {/* HEADER */}
            <div className="flex justify-between text-[13px] text-gray-400 font-bold mb-4">
              <span>{order?.order_number ?? "N/A"}</span>
            </div>

            {/* ITEMS */}
            <div className="space-y-3 mb-6 max-h-[160px] overflow-y-auto pr-2">
              {items.length ? (
                  items.map((item) => (
                      <div
                          key={item.id}
                          className="flex justify-between items-center text-gray-600"
                      >
                  <span className="text-base font-medium">
                    {item.product?.name ?? "Unknown Item"}
                  </span>

                        <span className="text-base font-bold">
                    x{item.quantity ?? 0}
                  </span>
                      </div>
                  ))
              ) : (
                  <p className="text-sm text-gray-400">No items found</p>
              )}
            </div>

            <div className="border-t border-gray-200 border-dashed my-5" />

            {/* TOTALS */}
            <div className="space-y-2.5 text-gray-500">
              <div className="flex justify-between text-[15px]">
                <span>បញ្ចុះតម្លៃ</span>
                <span className="font-bold text-gray-700">
                {format(order?.discount_total)}$
              </span>
              </div>

              <div className="flex justify-between text-[15px]">
                <span>តម្លៃសរុប</span>
                <span className="font-bold text-gray-700">
                {format(order?.grand_total)}$
              </span>
              </div>

              <div className="flex justify-between text-[15px]">
                <span>ទូទាត់តាម</span>
                <span className="font-bold text-gray-700">
                {order?.payment_method === "KHQR" ? "KHQR" : "លុយសុទ្ធ"}
              </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <p className="text-xl md:text-2xl text-[#338A00] font-bold font-khmer mt-10 text-center">
            សូមអរគុណសម្រាប់ការគាំទ្រ🙏
          </p>
        </div>
      </div>
  );
};

export default PaymentSuccessModal;