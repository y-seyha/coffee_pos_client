"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { SectionCard } from "./SectionCard";

type Props = {
    data: { date: string; revenue: number }[];
};

export function RevenueChart({ data }: Props) {
    return (
        <SectionCard title="Revenue Over Time">
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </SectionCard>
    );
}