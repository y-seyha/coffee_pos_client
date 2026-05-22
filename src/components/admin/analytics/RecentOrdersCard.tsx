"use client";

import { SectionCard } from "./SectionCard";
import { Order } from "@/types";
import { useRouter } from "next/navigation";

type Props = {
    orders?: Order[];
};

function getStatusColor(status: string) {
    switch (status) {
        case "COMPLETED":
            return "text-green-500";
        case "PENDING":
            return "text-yellow-500";
        case "CANCELLED":
            return "text-red-500";
        case "CONFIRMED":
            return "text-blue-500";
        default:
            return "text-muted-foreground";
    }
}

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export function RecentOrdersCard({ orders = [] }: Props) {
    const router = useRouter();

    const safeOrders = Array.isArray(orders) ? orders : [];

    const latest = [...safeOrders]
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        )
        .slice(0, 5);

    return (
        <SectionCard
            title="Recent Orders"
            rightAction={
                <button
                    onClick={() => router.push("/admin/orders")}
                    className="text-sm font-medium text-blue-600 hover:underline"
                >
                    View all
                </button>
            }
        >
            <div className="space-y-3">
                {latest.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No recent orders
                    </p>
                ) : (
                    latest.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition"
                        >
                            <div>
                                <p className="text-sm font-medium">
                                    #{order.order_number ?? order.id}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    {order.payments?.[0]?.payment_status ?? "No payment"}
                                </p>
                            </div>

                            <div className="text-right">
                                <p
                                    className={`text-sm font-semibold ${getStatusColor(
                                        order.order_status
                                    )}`}
                                >
                                    {order.order_status}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    ${order.grand_total} •{" "}
                                    {timeAgo(order.created_at)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </SectionCard>
    );
}