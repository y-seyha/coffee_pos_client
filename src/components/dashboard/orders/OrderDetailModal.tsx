"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Order } from "@/types";
type Props = {
    open: boolean;
    onClose: () => void;
    order: Order | null;
};

export function OrderDetailModal({ open, onClose, order }: Props) {
    if (!order) return null;

    const payment = order.payments?.[0];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">

                {/* HEADER */}
                <DialogHeader>
                    <DialogTitle>
                        Order #{order.order_number}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 text-sm">

                    <div className="grid grid-cols-2 gap-3 border p-3 rounded-lg">
                        <Info label="Status" value={order.order_status} />
                        <Info label="Type" value={order.order_type} />
                        <Info label="Staff ID" value={order.staff_id ?? "-"} />
                        <Info label="Created" value={new Date(order.created_at).toLocaleString()} />
                        <Info label="Updated" value={new Date(order.updated_at).toLocaleString()} />
                        <Info label="Notes" value={order.notes || "-"} />
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Items</h3>

                        <div className="border rounded-lg divide-y">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between p-2"
                                >
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p>${item.unit_price}</p>
                                        <p className="text-xs text-gray-500">
                                            Total: ${item.total_price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Payment</h3>

                        {payment ? (
                            <div className="border rounded-lg p-3 space-y-1">
                                <p>Method: {payment.payment_method}</p>
                                <p>Status: {payment.payment_status}</p>
                                <p>Amount: ${payment.amount}</p>
                                <p>
                                    Paid At:{" "}
                                    {payment.paid_at
                                        ? new Date(payment.paid_at).toLocaleString()
                                        : "-"}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No payment found</p>
                        )}
                    </div>

                    <div className="border-t pt-3 flex justify-between font-semibold">
                        <span>Grand Total</span>
                        <span>${Number(order.grand_total).toFixed(2)}</span>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}

function Info({ label, value }: { label: string; value: any }) {
    return (
        <div>
            <p className="text-gray-500 text-xs">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    );
}