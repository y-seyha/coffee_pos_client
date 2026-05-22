import {AnalyticsReport} from "@/types/index";

export function normalizeReport(report: any): AnalyticsReport {
    if (!report) {
        return {
            summary: { total_orders: 0, completed_orders: 0, pending_orders: 0 },
            sales: { daily: 0, monthly: 0 },
            top_products: [],
            status_stats: [],
            payment: undefined,
        };
    }

    const statusMap = Object.fromEntries(
        (report.status_stats ?? []).map((s: any) => [
            s.status,
            Number(s.count),
        ])
    );

    return {
        summary: {
            total_orders: Object.values(statusMap).reduce(
                (a: number, b: number) => a + b,
                0
            ),
            completed_orders: statusMap.COMPLETED ?? 0,
            pending_orders: statusMap.PENDING ?? 0,
            cancelled_orders: statusMap.CANCELLED ?? 0,
            confirmed_orders: statusMap.CONFIRMED ?? 0,
        },

        sales: {
            daily: Number(report.sales?.daily ?? 0),
            monthly: Number(report.sales?.monthly ?? 0),
        },

        top_products: (report.top_products ?? []).map((p: any) => ({
            product_id: p.product_id,
            name: p.name,
            total_sold: Number(p.total_sold),
        })),

        status_stats: (report.status_stats ?? []).map((s: any) => ({
            status: s.status,
            count: Number(s.count),
        })),

        payment: report.payment,
    };
}