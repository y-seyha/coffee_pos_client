"use client";

import { useEffect, useState } from "react";
import { orderApi } from "@/lib/api/order.api";
import { Order } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    Banknote,
    Check,
} from "lucide-react";

import { toast } from "sonner";
import { AppTable } from "@/components/dashboard/AppTable";
import { AppTableHeader } from "@/components/dashboard/AppTableHeader";
import { AppTableRow } from "@/components/dashboard/AppTableRow";
import { AppTableCell } from "@/components/dashboard/AppTableCell";
import {OrderDetailModal} from "@/components/dashboard/orders/OrderDetailModal";
import {OrderKpi} from "@/components/dashboard/orders/OrderKpi";

export default function OrderDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [open, setOpen] = useState(false);

    const [meta, setMeta] = useState({
        total: 0,
        page: 1,
        lastPage: 1,
    });

    const fetchOrders = async () => {
        try {
            const res = await orderApi.getList({
                page,
                limit: 10,
                search: search || undefined,
                status: status || undefined,
                type: type || undefined,
            });

            setOrders(res.data);
            setMeta({
                total: res.total,
                page: res.page,
                lastPage: res.total_pages,
            });
        } catch {
            toast.error("Failed to load orders");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, search, status, type]);

    const getStatusBadge = (s: string) => {
        const base = "px-2 py-1 rounded-full text-xs font-medium";

        switch (s) {
            case "PENDING":
                return `${base} bg-yellow-100 text-yellow-700`;
            case "CONFIRMED":
                return `${base} bg-blue-100 text-blue-700`;
            case "COMPLETED":
                return `${base} bg-green-100 text-green-700`;
            case "CANCELLED":
                return `${base} bg-red-100 text-red-700`;
            default:
                return `${base} bg-gray-100 text-gray-700`;
        }
    };

    const getPaymentBadge = (s?: string) => {
        const base = "px-2 py-1 rounded-full text-xs font-medium";

        switch (s) {
            case "PAID":
                return `${base} bg-green-100 text-green-700`;
            case "PENDING":
                return `${base} bg-yellow-100 text-yellow-700`;
            case "FAILED":
                return `${base} bg-red-100 text-red-700`;
            default:
                return `${base} bg-gray-100 text-gray-700`;
        }
    };

    return (
        <div className="p-6 space-y-6">

            <div>
                <h1 className="text-2xl font-bold">Order Management</h1>
                <p className="text-sm text-muted-foreground">
                    Manage orders with full lifecycle control
                </p>
            </div>

            {/* KPI */}
            <OrderKpi />

            {/* FILTER */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white border p-4 rounded-2xl">

                <Input
                    placeholder="Search order / ID / number"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border rounded-lg px-3"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                    className="border rounded-lg px-3"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="">All Type</option>
                    <option value="DINEIN">Dine In</option>
                    <option value="DELIVERY">Delivery</option>
                    <option value="TAKEAWAY">Takeaway</option>
                </select>

                <Button onClick={fetchOrders}>Apply</Button>
            </div>

            {/* TABLE */}
            <AppTable>
                <AppTableHeader cols={11}>
                    <div>No.</div>
                    <div>ID</div>
                    <div>Order</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div>Payment</div>
                    <div>Items</div>
                    <div>Total</div>
                    <div>Created</div>
                    <div>Notes</div>
                    <div>Actions</div>
                </AppTableHeader>

                {orders.map((o,i) => {
                    const payment = o.payments?.[0];

                    const canConfirm = o.order_status === "PENDING";
                    const canComplete = o.order_status === "CONFIRMED";
                    const canCancel =
                        o.order_status !== "CANCELLED" &&
                        o.order_status !== "COMPLETED";

                    return (
                        <AppTableRow key={o.id} cols={11} index={o.id}>


                            <AppTableCell>
    <span className="text-sm font-medium text-muted-foreground">
        {i + 1}
    </span>
                            </AppTableCell>
                            {/* ID */}
                            <AppTableCell>
                                <span className="font-medium">#{o.id}</span>
                            </AppTableCell>

                            {/* ORDER */}
                            <AppTableCell>
                                <div>
                                    <p className="font-medium">{o.order_number}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Staff: {o.staff_id ?? "-"}
                                    </p>
                                </div>
                            </AppTableCell>

                            {/* TYPE */}
                            <AppTableCell>
                                <span className="px-2 py-1 text-xs rounded bg-gray-100">
                                    {o.order_type}
                                </span>
                            </AppTableCell>

                            {/* STATUS */}
                            <AppTableCell>
                                <span className={getStatusBadge(o.order_status)}>
                                    {o.order_status}
                                </span>
                            </AppTableCell>

                            {/* PAYMENT */}
                            <AppTableCell>
                                <div className="space-y-1">
                                    <span className={getPaymentBadge(payment?.payment_status)}>
                                        {payment?.payment_status || "NO PAYMENT"}
                                    </span>

                                    {payment && (
                                        <p className="text-xs text-muted-foreground">
                                            {payment.payment_method} • ${payment.amount}
                                        </p>
                                    )}
                                </div>
                            </AppTableCell>

                            {/* ITEMS */}
                            <AppTableCell>
                                <span>{o.items?.length ?? 0} items</span>
                                <div className="text-xs text-muted-foreground">
                                    {o.items?.slice(0, 2).map(i => i.name).join(", ")}
                                </div>
                            </AppTableCell>

                            {/* TOTAL */}
                            <AppTableCell>
                                <span className="font-semibold">
                                    ${Number(o.grand_total).toFixed(2)}
                                </span>
                            </AppTableCell>

                            {/* DATE */}
                            <AppTableCell>
                                <span className="text-xs">
                                    {new Date(o.created_at).toLocaleString()}
                                </span>
                            </AppTableCell>

                            {/* NOTES */}
                            <AppTableCell>
                                <span className="text-xs text-muted-foreground">
                                    {o.notes || "-"}
                                </span>
                            </AppTableCell>

                            {/* ACTIONS */}
                            <AppTableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">

                                        <DropdownMenuItem
                                            onClick={() => {
                                                setSelectedOrder(o);
                                                setOpen(true);
                                            }}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </DropdownMenuItem>

                                        {/* CONFIRM */}
                                        <DropdownMenuItem
                                            disabled={!canConfirm}
                                            onClick={async () => {
                                                await orderApi.confirm(o.id, {});
                                                toast.success("Order confirmed");
                                                fetchOrders();
                                            }}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                                            Confirm
                                        </DropdownMenuItem>

                                        {/* COMPLETE */}
                                        <DropdownMenuItem
                                            disabled={!canComplete}
                                            onClick={async () => {
                                                await orderApi.complete(o.id, {});
                                                toast.success("Order completed");
                                                fetchOrders();
                                            }}
                                        >
                                            <Check className="w-4 h-4 mr-2 text-green-600" />
                                            Complete
                                        </DropdownMenuItem>

                                        {/* CANCEL */}
                                        <DropdownMenuItem
                                            disabled={!canCancel}
                                            onClick={async () => {
                                                await orderApi.cancel(o.id, {
                                                    reason: "Cancelled by admin",
                                                });
                                                toast.success("Order cancelled");
                                                fetchOrders();
                                            }}
                                        >
                                            <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                            Cancel
                                        </DropdownMenuItem>

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </AppTableCell>

                        </AppTableRow>
                    );
                })}
            </AppTable>

            {/* PAGINATION */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    Page {meta.page} of {meta.lastPage}
                </p>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={meta.page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Prev
                    </Button>

                    <Button
                        variant="outline"
                        disabled={meta.page >= meta.lastPage}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
                {/*//Modal*/}
                <OrderDetailModal
                    open={open}
                    onClose={() => setOpen(false)}
                    order={selectedOrder}
                />
            </div>


        </div>
    );
}