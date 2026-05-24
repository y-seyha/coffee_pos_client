"use client";

import { useEffect, useState } from "react";
import { paymentApi } from "@/lib/api/payment.api";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Payment, PaymentDashboard } from "@/types";
import {PaymentSummaryCard} from "@/components/admin/analytics/PaymentSummaryCard";
import {AppTable} from "@/components/dashboard/AppTable";
import {AppTableHeader} from "@/components/dashboard/AppTableHeader";
import {AppTableRow} from "@/components/dashboard/AppTableRow";
import {AppTableCell} from "@/components/dashboard/AppTableCell";
import {PaymentActionsDropdown} from "@/components/dashboard/payments/PaymentActionsDropdown";
import {toast} from "sonner";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {RefreshCw} from "lucide-react";

export default function PaymentsPage() {
    const [dashboard, setDashboard] = useState<PaymentDashboard | undefined>(undefined);
    const [data, setData] = useState<Payment[]>([]);
    const [_loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [filters, setFilters] = useState({page: 1, limit: 10,});
    const [actionLoading, setActionLoading] = useState(false);
    const [refundOpen, setRefundOpen] = useState(false);
    const [refundReason, setRefundReason] = useState("");
    const [selectedRefundId, setSelectedRefundId] = useState<number | null>(null);

    const fetchDashboard = async () => {
        const res = await paymentApi.getPaymentDashboard();
        setDashboard(res);
    };

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await paymentApi.getAll(filters);
            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [filters]);

    const markPaid = async (id: number) => {
        setActionLoading(true);

        try {
            await paymentApi.markPaid(id, {
                transaction_id: "MANUAL-" + Date.now(),
                remarks: "Marked by admin",
            });

            toast.success("Payment marked as PAID");

            await Promise.all([fetchPayments(), fetchDashboard()]);
        } catch (err) {
            toast.error("Failed to mark payment as paid");
        } finally {
            setActionLoading(false);
        }
    };

    const markFailed = async (id: number) => {
        setActionLoading(true);

        try {
            await paymentApi.markFailed(id, "Marked manually");

            toast.success("Payment marked as FAILED");

            await Promise.all([fetchPayments(), fetchDashboard()]);
        } catch (err) {
            toast.error("Failed to mark payment as failed");
        } finally {
            setActionLoading(false);
        }
    };

    const openDetails = (payment: Payment) => {
        setSelectedPayment(payment);
    };

    const openRefundModal = (id: number) => {
        setSelectedRefundId(id);
        setRefundReason("");
        setRefundOpen(true);
    };

    const confirmRefund = async () => {
        if (!selectedRefundId) return;

        if (!refundReason.trim()) {
            toast.error("Refund reason is required");
            return;
        }
        setActionLoading(true);

        try {
            await paymentApi.refund(selectedRefundId, refundReason);

            toast.success("Payment refunded successfully");

            await Promise.all([fetchPayments(), fetchDashboard()]);

            setRefundOpen(false);
            setRefundReason("");
            setSelectedRefundId(null);
        } catch (err) {
            toast.error("Refund failed Or Payment need to be Paid");
        } finally {
            setActionLoading(false);
        }
    };
    const refreshAll = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchPayments(), fetchDashboard()]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            fetchPayments();
            fetchDashboard();
        }, 30000);

        return () => clearInterval(interval);
    }, [filters]);


    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Payments Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage payments, refunds and transaction status
                    </p>
                </div>

                <Button onClick={refreshAll}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${_loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-green-600">
                        ${dashboard?.revenue ?? 0}
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Today</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        {dashboard?.today_payments ?? 0}
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Failed</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-red-500">
                        {dashboard?.failed_payments ?? 0}
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Refunded</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-orange-500">
                        {dashboard?.refunded_payments ?? 0}
                    </CardContent>
                </Card>
            </div>

            {/*Latest Transactions  CHART + PAYMENTS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

                {/* LEFT: Latest Transactions */}
                <div className="rounded-2xl border bg-background p-4 h-[480px] flex flex-col">

                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-sm">Latest Transactions</h2>
                        <span className="text-xs text-muted-foreground">
                {dashboard?.latest_transactions?.length ?? 0} items
            </span>
                    </div>

                    {/* SCROLL ONLY HERE */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                        {dashboard?.latest_transactions?.map((t) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50 transition"
                            >
                                <div className="space-y-1">
                                    <p className="font-medium text-sm">{t.payment_number}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {t.order?.order_number}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t.payment_method}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold">${t.amount}</p>

                                    <span
                                        className={`text-[11px] px-2 py-1 rounded-full ${
                                            t.payment_status === "PAID"
                                                ? "bg-green-100 text-green-700"
                                                : t.payment_status === "FAILED"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-orange-100 text-orange-700"
                                        }`}
                                    >
                            {t.payment_status}
                        </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: PAYMENT SUMMARY ONLY (NO EMPTY SPACE) */}
                <div className="rounded-2xl border bg-background p-4 h-[480px] flex flex-col">

                    <PaymentSummaryCard dashboard={dashboard} />
                </div>

            </div>


            {/* FILTERS */}
            <div className="mt-4 md:mt-0 bg-white border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">

                <Select
                    onValueChange={(v) =>
                        setFilters((prev) => ({ ...prev, status: v }))
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    placeholder="Transaction ID"
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            transaction_id: e.target.value,
                        }))
                    }
                />

                <Input
                    placeholder="Order Number"
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            order_number: e.target.value,
                        }))
                    }
                />

                <Button onClick={fetchPayments}>
                    Apply Filters
                </Button>
            </div>

            {/* TABLE */}
            <AppTable>
                <AppTableHeader cols={7}>
                    <div>No.</div>
                    <div>Payment</div>
                    <div>Order</div>
                    <div>Method</div>
                    <div>Status</div>
                    <div>Amount</div>
                    <div >Actions</div>
                </AppTableHeader>

                {data.map((p, i) => (
                    <AppTableRow key={p.id} index={i} cols={7}>

                        <AppTableCell>
    <span className="text-sm font-medium text-muted-foreground">
        {i + 1}
    </span>
                            </AppTableCell>
                        {/* Payment */}
                        <AppTableCell>
                            <div>
                                <p className="font-medium">{p.payment_number}</p>
                            </div>
                        </AppTableCell>

                        {/* Order */}
                        <AppTableCell>
                            <p className="text-sm text-muted-foreground">
                                {p.order?.order_number}
                            </p>
                        </AppTableCell>

                        {/* Method */}
                        <AppTableCell>
                            {p.payment_method}
                        </AppTableCell>

                        {/* Status */}
                        <AppTableCell>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                        p.payment_status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : p.payment_status === "FAILED"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
                    }`}
                >
                    {p.payment_status}
                </span>
                        </AppTableCell>

                        {/* Amount */}
                        <AppTableCell>
                <span className="font-semibold">
                    ${p.amount}
                </span>
                        </AppTableCell>

                        {/* Actions */}
                        <AppTableCell>
                            {/*<div className="flex justify-end">*/}
                                <PaymentActionsDropdown
                                    payment={p}
                                    onView={() => openDetails(p)}
                                    onPaid={() => markPaid(p.id)}
                                    onFailed={() => markFailed(p.id)}
                                    onRefund={() => openRefundModal(p.id)}
                                />
                            {/*</div>*/}
                        </AppTableCell>

                    </AppTableRow>
                ))}
            </AppTable>

            {/* PAGINATION */}
            <div className="flex items-center justify-between gap-2">

                {/* PAGE INFO */}
                <p className="text-sm text-muted-foreground">
                    Page <span className="font-medium">{filters.page}</span>
                </p>

                {/* CONTROLS */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={filters.page === 1}
                        onClick={() =>
                            setFilters((p) => ({
                                ...p,
                                page: Math.max(1, p.page - 1),
                            }))
                        }
                    >
                        Prev
                    </Button>

                    <Button variant="outline" disabled>
                        {filters.page}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() =>
                            setFilters((p) => ({
                                ...p,
                                page: p.page + 1,
                            }))
                        }
                    >
                        Next
                    </Button>
                </div>

            </div>

            {selectedPayment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[650px] max-w-[95%] rounded-2xl p-6 shadow-xl">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold">
                                Payment Details
                            </h2>

                            <Button
                                variant="ghost"
                                onClick={() => setSelectedPayment(null)}
                            >
                                Close
                            </Button>
                        </div>

                        {/* GRID DETAILS */}
                        <div className="grid grid-cols-2 gap-4 text-sm">

                            <Detail label="Payment #" value={selectedPayment.payment_number} />
                            <Detail label="Order #" value={selectedPayment.order?.order_number} />
                            <Detail label="Method" value={selectedPayment.payment_method} />
                            <Detail label="Status" value={selectedPayment.payment_status} />
                            <Detail label="Amount" value={`$${selectedPayment.amount}`} />

                            <Detail
                                label="Paid At"
                                value={
                                    selectedPayment.paid_at
                                        ? new Date(selectedPayment.paid_at).toLocaleString()
                                        : "-"
                                }
                            />

                        </div>

                        {/* FULL WIDTH */}
                        <div className="mt-4 space-y-2 text-sm">

                            <Detail label="Remarks" value={selectedPayment.remarks ?? "-"} />
                            <Detail label="Order Status" value={selectedPayment.order?.order_status} />

                        </div>

                    </div>
                </div>
            )}

            <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Refund Payment</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Please provide a reason for this refund
                        </p>

                        <Textarea
                            className="w-full border rounded-lg p-3 min-h-[120px]"
                            placeholder="Enter refund reason..."
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setRefundOpen(false)}
                            disabled={!refundReason.trim() || actionLoading}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={confirmRefund}
                            disabled={actionLoading}
                        >
                            {actionLoading ? "Processing..." : "Confirm Refund"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    );

}

function Detail({
                    label,
                    value,
                }: {
    label: string;
    value?: string | number | null;
}) {
    return (
        <div>
            <p className="text-muted-foreground text-xs">{label}</p>
            <p className="font-medium">{value ?? "-"}</p>
        </div>
    );
}