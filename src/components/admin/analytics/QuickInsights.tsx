"use client";

import { SectionCard } from "./SectionCard";

type Props = {
    topProduct?: string;
    orderStats?: any;
    dailySales?: any;
};

export function QuickInsights({ topProduct, orderStats }: Props) {
    return (
        <SectionCard title="Quick Insights">
            <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Best product: {topProduct ?? "N/A"}</li>
                <li>• Completed orders: {orderStats?.completed ?? 0}</li>
                <li>• Pending orders: {orderStats?.pending ?? 0}</li>
                <li>• Status: Stable growth trend</li>
            </ul>
        </SectionCard>
    );
}