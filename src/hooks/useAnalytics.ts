"use client";

import { useEffect, useState } from "react";
import { normalizeReport } from "@/types/analytics.mapper";
import {AnalyticsReport, Order} from "@/types";
import {orderApi} from "@/lib/api/order.api";
import {paymentApi} from "@/lib/api/payment.api";

export function useAnalytics() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [report, setReport] = useState<AnalyticsReport | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const [orderReport, payment, recentOrdersRes] = await Promise.all([
                orderApi.getReport(),
                paymentApi.getPaymentDashboard(),
                orderApi.getAll({ limit: 10 }),
            ]);

            setReport(
                normalizeReport({
                    ...orderReport,
                    payment,
                })
            );

            setOrders(recentOrdersRes.data ?? []);
        } catch (err: any) {
            setError(err?.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAnalytics();
    }, []);

    return { loading, error, report, orders, refetch: fetchAnalytics };
}