"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Area,
} from "recharts";

type Props = {
    data: {
        date: string;
        revenue: number;
        previousRevenue?: number;
    }[];
};

export function RevenueChart({ data }: Props) {
    const total = data.reduce((sum, d) => sum + d.revenue, 0);
    const prevTotal = data.reduce(
        (sum, d) => sum + (d.previousRevenue ?? 0),
        0
    );

    const growth =
        prevTotal === 0 ? 0 : ((total - prevTotal) / prevTotal) * 100;

    const isUp = growth >= 0;

    return (
        <div className="h-full w-full space-y-3">

            {/* HEADER INSIDE CHART */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold">Revenue Trend</p>
                    <p className="text-xs text-muted-foreground">
                        Compared to previous period
                    </p>
                </div>

                <div
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isUp
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {isUp ? "▲" : "▼"} {Math.abs(growth).toFixed(1)}%
                </div>
            </div>

            {/* CHART */}
            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            opacity={0.4}
                        />

                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: "#6b7280" }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            tick={{ fontSize: 12, fill: "#6b7280" }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            contentStyle={{
                                borderRadius: 12,
                                border: "1px solid #e5e7eb",
                                fontSize: 12,
                            }}
                        />

                        {/* gradient */}
                        <defs>
                            <linearGradient
                                id="revGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.05}
                                />
                            </linearGradient>
                        </defs>

                        {/* previous period (dashed comparison line) */}
                        <Line
                            type="monotone"
                            dataKey="previousRevenue"
                            stroke="#9ca3af"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            dot={false}
                        />

                        {/* main line */}
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }}
                            animationDuration={800}
                        />

                        {/* fill under main line */}
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="none"
                            fill="url(#revGradient)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}