import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import PaymentSelectionModal from "../modal/PaymentSelectionModal";
import SuccessModal from "../modal/PaymentSuccessModal";
import QRPaymentModal from "../modal/QRPaymentModal";

const CartItem = ({ item }: any) => {
  const { increaseQty, decreaseQty, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
      {/* Image */}
      <div className="w-20 h-28 bg-[#f8f8f8] rounded-[20px] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
        <img src={item.image} className="w-[72%] h-[72%] object-contain" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Khmer Menu  */}
        <h4 className="text-[15px] font-semibold text-black truncate">
          {item.name}
        </h4>
        <h4 className="text-[15px] font-semibold text-black truncate">
          {item.name}
        </h4>

        <p className="my-2 text-sm text-gray-400 truncate">
          {item.options.size} • {item.options.sugar}% sugar • {item.options.ice}
        </p>

        <div className="flex justify-between items-center ">
          {/* Price */}
          <span className="text-[#cd8c52] font-bold text-[16px]">
            {(item.price * item.quantity).toFixed(2)}$
          </span>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => decreaseQty(item.id)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-50 transition"
            >
              -
            </button>

            <span className="text-sm font-bold text-black w-5 text-center">
              {item.quantity}
            </span>

            <button
              onClick={() => increaseQty(item.id)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-50 transition"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="text-xs text-red-400 mt-2 hover:underline cursor-pointer"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

const CheckoutSidebar = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"QR" | "CASH">("CASH");
  const [showQRModal, setShowQRModal] = useState(false);

  const handleSelectPayment = (type: "QR" | "CASH") => {
    setShowPaymentModal(false);
    setSelectedMethod(type);

    if (type === "QR") {
      setShowQRModal(true);
    } else {
      // For cash, you might show success immediately or a different flow
      setShowSuccessModal(true);
    }
  };

  const handleCloseAll = () => {
    setShowSuccessModal(false);
    clearCart(); 
  };

  const handleQRSuccess = () => {
    setShowQRModal(false);
    setShowSuccessModal(true);
  };

  return (
    <aside className="w-full lg:w-[400px] bg-white h-full border-l border-gray-100 p-6 lg:p-8 flex flex-col">
      <h2 className="text-2xl font-bold text-[#d18b47] font-khmer text-center mb-8">
        ការទូទាត់ប្រាក់
      </h2>

      {/* CART ITEMS */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No items in cart</p>
        ) : (
          items.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>

      {/* TOTAL */}
      <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-3">
        <div className="flex justify-between text-sm text-gray-400">
          <span>តម្លៃ</span>
          <span>{getTotalPrice().toFixed(2)}$</span>
        </div>

        <div className="flex justify-between text-sm text-gray-400">
          <span>បញ្ចុះតម្លៃ</span>
          <span className="text-yellow-500">0.00$</span>
        </div>

        <div className="flex justify-between font-bold text-lg text-[#cd8c52] pt-2">
          <span>តម្លៃសរុប</span>
          <span>{getTotalPrice().toFixed(2)}$</span>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowClearModal(true)}
            className="w-1/3 py-3 border rounded-2xl text-gray-500"
          >
            លុបចេញ
          </button>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-2/3 py-4 bg-[#7487ff] text-white rounded-2xl cursor-pointer font-bold shadow-lg shadow-blue-100 hover:opacity-90 transition-opacity"
          >
            ទូទាត់
          </button>
        </div>
      </div>

      {showClearModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[320px] rounded-2xl p-6 shadow-xl border">
            <h3 className="text-lg font-bold text-center text-[#333]">
              Clear cart?
            </h3>

            <p className="text-sm text-gray-400 text-center mt-2">
              This will remove all items from your cart.
            </p>

            <div className="flex gap-3 mt-6">
              {/* Cancel */}
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2 rounded-xl border text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>

              {/* Confirm */}
              <button
                onClick={() => {
                  clearCart();
                  setShowClearModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <PaymentSelectionModal
          onClose={() => setShowPaymentModal(false)}
          onSelectPayment={handleSelectPayment}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          items={items}
          totalPrice={getTotalPrice()}
          paymentMethod={selectedMethod}
          onClose={handleCloseAll}
        />
      )}

      {showQRModal && (
        <QRPaymentModal
          onClose={() => setShowQRModal(false)}
          onPaymentSuccess={handleQRSuccess}
        />
      )}
    </aside>
  );
};

export default CheckoutSidebar;
