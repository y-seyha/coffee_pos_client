"use client";

import { useMemo, useState } from "react";

import { useAnalytics } from "@/hooks/useAnalytics";

import { ChartHeader } from "@/components/admin/analytics/ChartHeader";
import { StatCard } from "@/components/admin/analytics/StatCard";
import { StatGrid } from "@/components/admin/analytics/StatGrid";
import { SectionCard } from "@/components/admin/analytics/SectionCard";
import { EmptyState } from "@/components/admin/analytics/EmptyState";

import { RevenueChart } from "@/components/admin/analytics/RevenueChart";
import { OrderStatusPanel } from "@/components/admin/analytics/OrderStatusPanel";
import { QuickInsights } from "@/components/admin/analytics/QuickInsights";

import {
    ShoppingCart,
    TrendingUp,
    DollarSign,
    Package,
} from "lucide-react";

type FilterType = "Today" | "Month";


import { PaymentSummaryCard } from "@/components/admin/analytics/PaymentSummaryCard";
import {RecentOrdersCard} from "@/components/admin/analytics/RecentOrdersCard";

export default function AnalyticsPage() {
    const [filter, setFilter] = useState<FilterType>("Today");

    const { loading, error, report, orders } = useAnalytics();

    const revenue =
        filter === "Today"
            ? report?.sales?.daily
            : report?.sales?.monthly;


    const revenueChartData = useMemo(() => {
        if (!report) return [];

        return filter === "Today"
            ? [{date: "Today", revenue: report.sales.daily,},]
            : [{date: "This Month", revenue: report.sales.monthly,},];
    }, [filter, report]);

    const topProductName = report?.top_products?.[0]?.name;
    if (loading) {
        return (
            <div className="p-6 text-sm text-muted-foreground">
                Loading analytics...
            </div>
        );
    }

    if (error) {
        return <EmptyState message={error} />;
    }

    return (
        <div className="p-6 space-y-10">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">
                        Admin Analytics Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of sales, orders, and payments
                    </p>
                </div>

                <ChartHeader
                    active={filter}
                    onChange={setFilter}
                />
            </div>

            {/*KPI*/}
            <div className="space-y-4">
                <StatGrid>
                    <StatCard
                        title={
                            filter === "Today"
                                ? "Revenue (Today)"
                                : "Revenue (Monthly)"
                        }
                        value={revenue ?? 0}
                        icon={DollarSign}
                    />

                    <StatCard
                        title="Orders"
                        value={report?.summary?.total_orders ?? 0}
                        icon={ShoppingCart}
                    />

                    <StatCard
                        title="Completed"
                        value={report?.summary?.completed_orders ?? 0}
                        icon={TrendingUp}
                    />

                    <StatCard
                        title="Products"
                        value={report?.top_products?.length ?? 0}
                        icon={Package}
                    />
                </StatGrid>
            </div>

            {/*Chart*/}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 rounded-2xl border bg-background p-4">
                    <RevenueChart data={revenueChartData} />
                </div>

                <div className="rounded-2xl border bg-background p-4">
                    <PaymentSummaryCard dashboard={report?.payment} />
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <SectionCard title="Order Status">
                    <OrderStatusPanel
                        data={{
                            pending:
                                report?.status_stats?.find(
                                    s => s.status === "PENDING"
                                )?.count ?? 0,

                            processing:
                                report?.status_stats?.find(
                                    s => s.status === "CONFIRMED"
                                )?.count ?? 0,

                            completed:
                                report?.status_stats?.find(
                                    s => s.status === "COMPLETED"
                                )?.count ?? 0,

                            cancelled:
                                report?.status_stats?.find(
                                    s => s.status === "CANCELLED"
                                )?.count ?? 0,
                        }}
                    />
                </SectionCard>

                <SectionCard title="Top Products">
                    {report?.top_products?.length ? (
                        <div className="space-y-3">
                            {report.top_products.map(
                                (p: any, i: number) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <span className="font-medium">
                                            {p.name}
                                        </span>

                                        <span className="text-sm text-muted-foreground">
                                            {p.total_sold}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <EmptyState message="No products data" />
                    )}
                </SectionCard>
            </div>

            {/*Insight*/}
            <div className="flex flex-col xl:flex-row gap-6">

                {/* Quick Insights */}
                <div className="flex-1">
                    <QuickInsights
                        topProduct={topProductName}
                        orderStats={{
                            pending:
                                report?.status_stats?.find(
                                    s => s.status === "PENDING"
                                )?.count ?? 0,

                            processing:
                                report?.status_stats?.find(
                                    s => s.status === "CONFIRMED"
                                )?.count ?? 0,

                            completed:
                                report?.status_stats?.find(
                                    s => s.status === "COMPLETED"
                                )?.count ?? 0,

                            cancelled:
                                report?.status_stats?.find(
                                    s => s.status === "CANCELLED"
                                )?.count ?? 0,
                        }}
                    />
                </div>

                {/* Recent Orders */}
                <div className="flex-1 rounded-2xl border bg-background p-4">
                    <RecentOrdersCard orders={orders} />
                </div>

            </div>
        </div>
    );
}