"use client";

import { useEffect, useState } from "react";
import { orderApi } from "@/lib/api/order.api";
import { ShoppingCart, CheckCircle, Clock, DollarSign } from "lucide-react";


type Report = {
    summary: {
        total_orders: number;
        completed_orders: number;
        pending_orders: number;
    };
    sales: {
        daily: number;
        monthly: number;
    };
    status_stats: {
        status: string;
        count: number;
    }[];
};
function KpiCard({
                     title,
                     value,
                     icon: Icon,
                     color,
                 }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
}) {
    return (
        <div className="flex items-center justify-between p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>

            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
    );
}

export function OrderKpi() {
    const [report, setReport] = useState<Report | null>(null);

    const fetchReport = async () => {
        try {
            const res = await orderApi.getReport();
            setReport(res);
        } catch (err) {
            console.error("Failed to load KPI", err);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    if (!report) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-24 bg-gray-100 rounded-2xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* MAIN KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <KpiCard
                    title="Total Orders"
                    value={report.summary.total_orders}
                    icon={ShoppingCart}
                    color="bg-gray-800"
                />

                <KpiCard
                    title="Completed Orders"
                    value={report.summary.completed_orders}
                    icon={CheckCircle}
                    color="bg-green-600"
                />

                <KpiCard
                    title="Pending Orders"
                    value={report.summary.pending_orders}
                    icon={Clock}
                    color="bg-yellow-500"
                />
            </div>

            {/*/!* SALES *!/*/}
            {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">*/}

            {/*    <div className="p-6 rounded-2xl border bg-gradient-to-r from-blue-50 to-white">*/}
            {/*        <p className="text-sm text-muted-foreground">Today Revenue</p>*/}
            {/*        <p className="text-3xl font-bold mt-2 text-blue-700">*/}
            {/*            ${Number(report.sales.daily).toFixed(2)}*/}
            {/*        </p>*/}
            {/*    </div>*/}

            {/*    <div className="p-6 rounded-2xl border bg-gradient-to-r from-purple-50 to-white">*/}
            {/*        <p className="text-sm text-muted-foreground">Monthly Revenue</p>*/}
            {/*        <p className="text-3xl font-bold mt-2 text-purple-700">*/}
            {/*            ${Number(report.sales.monthly).toFixed(2)}*/}
            {/*        </p>*/}
            {/*    </div>*/}

            {/*</div>*/}
        </div>
    );
}