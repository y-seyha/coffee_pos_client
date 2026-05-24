import { useState } from "react";

import { X } from "lucide-react";
import {useCart} from "@/context/CartContext";

interface Props {
    onNext: () => void;
    onClose: () => void;
}

const CheckoutInfoModal = ({ onNext, onClose }: Props) => {
    const { setCheckoutInfo } = useCart();

    const [orderType, setOrderType] = useState<"DINEIN" | "TAKEAWAY">("DINEIN");
    const [tableId, setTableId] = useState<number | undefined>();
    const [notes, setNotes] = useState("");

    const handleContinue = () => {
        setCheckoutInfo({
            order_type: orderType,
            table_id: orderType === "DINEIN" ? tableId : undefined,
            notes,
        });

        onNext();
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-gray-100 p-7">

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition"
                >
                    <X size={18} />
                </button>

                {/* TITLE */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#cd8c52]">
                        ព័ត៌មានការបញ្ជាទិញ
                    </h2>

                    <p className="text-sm text-gray-400 mt-1">
                        សូមបំពេញព័ត៌មានមុនពេលទូទាត់ប្រាក់
                    </p>
                </div>

                {/* ORDER TYPE */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ប្រភេទការបញ្ជាទិញ
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setOrderType("DINEIN")}
                            className={`p-3 rounded-2xl border font-semibold transition-all
              ${
                                orderType === "DINEIN"
                                    ? "bg-[#cd8c52] text-white border-[#cd8c52] shadow-md"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            ញុំានៅហាង
                        </button>

                        <button
                            onClick={() => setOrderType("TAKEAWAY")}
                            className={`p-3 rounded-2xl border font-semibold transition-all
              ${
                                orderType === "TAKEAWAY"
                                    ? "bg-[#7487ff] text-white border-[#7487ff] shadow-md"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            វេចខ្ចប់
                        </button>
                    </div>
                </div>

                {/* TABLE ID */}
                {orderType === "DINEIN" && (
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            លេខតុ
                        </label>

                        <input
                            type="number"
                            placeholder="បញ្ចូលលេខតុ"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#cd8c52]"
                            onChange={(e) => setTableId(Number(e.target.value))}
                        />
                    </div>
                )}

                {/* NOTES */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        កំណត់ចំណាំ
                    </label>

                    <textarea
                        rows={4}
                        placeholder="សំណើពិសេស ឬកំណត់ចំណាំ..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#cd8c52]"
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                    >
                        បោះបង់
                    </button>

                    <button
                        onClick={handleContinue}
                        className="flex-1 py-3 rounded-2xl bg-[#7487ff] text-white font-bold shadow-lg shadow-blue-100 hover:opacity-90 transition"
                    >
                        បន្ត
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CheckoutInfoModal;