"use client"

import { Trash2 } from "lucide-react";
import { useState } from "react";
import PaymentSelectionModal from "../payment/PaymentSelectionModal";
import SuccessModal from "../payment/PaymentSuccessModal";
import QRPaymentModal from "../payment/QRPaymentModal";
import {useCart} from "@/context/CartContext";
import {CheckoutApiResponse} from "@/types";
import CheckoutInfoModal from "@/components/client/modal/CheckoutInfoModal";
import ConfirmModal from "@/components/client/modal/ConfirmModal";



const CartItem = ({ item }: any) => {
    const { increaseQty, decreaseQty, removeItem } = useCart();

    return (
        <div className="flex gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm">

            {/* image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border">
                <img
                    src={item.product?.image || item.image}
                    className="w-[70%] h-[70%] object-contain"
                />
            </div>

            {/* content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">

                <div>
                    <h4 className="text-sm sm:text-[15px] font-bold text-gray-900 truncate">
                        {item.product?.name || "Unknown"}
                    </h4>

                    <div className="flex flex-wrap gap-1 mt-1">
                        {item.variants?.length ? (
                            item.variants.map((v: any, i: number) => (
                                <span
                                    key={i}
                                    className="text-[10px] sm:text-[11px] px-2 py-[2px] rounded-full bg-gray-100 text-gray-600"
                                >
                  {v.group}: {v.option}
                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-400">No options</span>
                        )}
                    </div>
                </div>

                {/* price + qty */}
                <div className="flex items-end justify-between mt-3">

                    <div className="flex flex-col">
            <span className="text-[#cd8c52] font-bold text-sm sm:text-[15px]">
              ${item.total_price.toFixed(2)}
            </span>
                        <span className="text-[10px] sm:text-[11px] text-gray-400">
              ${item.unit_price?.toFixed?.(2) ?? "0.00"} / item
            </span>
                    </div>

                    <div className="flex items-center bg-[#F7F1EA] rounded-full px-2 py-1 gap-2 border border-[#E6D5C5]">

                        <button
                            onClick={() => decreaseQty(item.id)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[#8B5E3C] "
                        >
                            -
                        </button>

                        <span className="text-xs sm:text-sm font-semibold w-6 text-center text-[#5A3E2B]">
              {item.quantity}
            </span>

                        <button
                            onClick={() => increaseQty(item.id)}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[#8B5E3C]"
                        >
                            +
                        </button>

                    </div>
                </div>

                <button
                    onClick={() => removeItem(item.id)}
                    className="mt-2 text-xs text-red-400 flex items-center gap-1 cursor-pointer"
                >
                    <Trash2 size={12} />
                    Remove
                </button>
            </div>
        </div>
    );
};

const CheckoutSidebar = ({
                             mobile = false,
                             onClose,
                         }: {
    mobile?: boolean;
    onClose?: () => void;
}) => {
    const { items, clearCart, summary, checkout } = useCart();

    const [showClearModal, setShowClearModal] = useState(false);
    const [showCheckoutInfo, setShowCheckoutInfo] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [completedOrder, setCompletedOrder] =
        useState<CheckoutApiResponse | null>(null);

    const handleSelectPayment = async (type: "KHQR" | "CASH") => {
        const order = await checkout(type);
        if (!order) return;

        setCompletedOrder(order);
        setShowPaymentModal(false);

        type === "KHQR"
            ? setShowQRModal(true)
            : setShowSuccessModal(true);
    };

    const handleQRSuccess = () => {
        setShowQRModal(false);
        setShowSuccessModal(true);
    };

    return (
        <aside
            className={`
        bg-white flex flex-col border-gray-100
        ${mobile
                ? "w-full h-[90vh] rounded-t-2xl p-4"
                : "w-full lg:w-[400px] h-full p-4 sm:p-6 lg:p-8 border-l"
            }
      `}
        >

            {/* MOBILE HEADER */}
            {mobile && (
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-[#d18b47] font-khmer">
                        Cart
                    </h2>

                    <button onClick={onClose} className="text-gray-500 text-sm">
                        Close
                    </button>
                </div>
            )}

            {/* HEADER */}
            {!mobile && (
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#d18b47] text-center font-khmer">
                        ការទូទាត់ប្រាក់
                    </h2>

                    <p className="text-center text-xs text-gray-400 mt-2">
                        Quantity: {summary?.quantity_total ?? 0}
                    </p>
                </div>
            )}

            {/* ITEMS */}
            <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto pr-1 sm:pr-2">
                {items.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10">
                        No items in cart
                    </p>
                ) : (
                    items.map((item) => <CartItem key={item.id} item={item} />)
                )}
            </div>

            {/* SUMMARY */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-2xl border bg-gray-50 space-y-2 sm:space-y-3">

                <div className="flex justify-between text-sm text-gray-500">
                    <span>មុនបញ្ចុះតម្លៃ</span>
                    <span>${summary?.subtotal?.toFixed(2) ?? "0.00"}</span>
                </div>

                <div className="flex justify-between text-sm text-red-400">
                    <span>បញ្ចុះតម្លៃ</span>
                    <span>- ${summary?.discount_total?.toFixed(2) ?? "0.00"}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                    <span>ពន្ធ</span>
                    <span>${summary?.tax?.toFixed(2) ?? "0.00"}</span>
                </div>

                <div className="flex justify-between font-bold text-base sm:text-lg text-[#cd8c52] border-t pt-2">
                    <span>សរុប</span>
                    <span>${summary?.grand_total?.toFixed(2) ?? "0.00"}</span>
                </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4 sm:mt-5">

                <button
                    onClick={() => setShowClearModal(true)}
                    className="w-1/3 py-2 sm:py-3 border rounded-2xl text-gray-500 text-sm"
                >
                    លុបចេញ
                </button>

                <button
                    onClick={() => setShowCheckoutInfo(true)}
                    disabled={items.length === 0}
                    className="w-2/3 py-3 sm:py-4 bg-[#7487ff] text-white rounded-2xl font-bold disabled:opacity-50 text-sm sm:text-base"
                >
                    ទូទាត់
                </button>

            </div>

            {/* MODALS stay SAME (no change needed) */}
            {showCheckoutInfo && (
                <CheckoutInfoModal
                    onClose={() => setShowCheckoutInfo(false)}
                    onNext={() => {
                        setShowCheckoutInfo(false);
                        setShowPaymentModal(true);
                    }}
                />
            )}

            {showPaymentModal && (
                <PaymentSelectionModal
                    onClose={() => setShowPaymentModal(false)}
                    onSelectPayment={handleSelectPayment}
                />
            )}

            {showQRModal && (
                <QRPaymentModal
                    order={completedOrder!.order}
                    onClose={() => setShowQRModal(false)}
                    onPaymentSuccess={handleQRSuccess}
                />
            )}

            {showSuccessModal && completedOrder && (
                <SuccessModal
                    order={completedOrder.order}
                    onClose={() => {
                        setShowSuccessModal(false);
                        clearCart();
                    }}
                />
            )}

            <ConfirmModal
                open={showClearModal}
                title="Clear Cart"
                description="This will remove all items from your cart. Are you sure?"
                confirmText="Clear"
                cancelText="Cancel"
                onCancel={() => setShowClearModal(false)}
                onConfirm={() => {
                    clearCart();
                    setShowClearModal(false);
                }}
            />

        </aside>
    );
};

export default CheckoutSidebar;
