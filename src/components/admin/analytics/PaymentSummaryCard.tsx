"use client";

import { SectionCard } from "./SectionCard";
import { PaymentDashboard } from "@/types";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Label,
} from "recharts";

type Props = {
    dashboard?: PaymentDashboard;
};

export function PaymentSummaryCard({ dashboard }: Props) {
    const methods = dashboard?.payment_methods ?? [];

    const cash = Number(
        methods.find((m) => m.method === "CASH")?.count ?? 0
    );

    const khqr = Number(
        methods.find((m) => m.method === "KHQR")?.count ?? 0
    );

    const data = [
        {
            name: "CASH",
            value: cash,
            color: "#3b82f6",
        },
        {
            name: "KHQR",
            value: khqr,
            color: "#ef4444",
        },
    ];

    const total = cash + khqr;

    return (
        <SectionCard title="Payment Methods">

            <div className="flex flex-col items-center justify-center">

                {/* PIE */}
                <div className="relative w-72 h-72">

                    {/* glow background */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 to-green-500/10 blur-3xl" />

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={78}
                                outerRadius={105}
                                paddingAngle={4}
                                cornerRadius={10}
                                dataKey="value"
                                stroke="none"

                                labelLine={{
                                    stroke: "hsl(var(--muted-foreground))",
                                    strokeWidth: 1,
                                }}
                                label={({
                                            name,
                                            percent,
                                            x,
                                            y,
                                            textAnchor,
                                        }) => (
                                    <text
                                        x={x}
                                        y={y}
                                        fill="currentColor"
                                        textAnchor={textAnchor}
                                        dominantBaseline="central"
                                        className="text-[11px] font-semibold"
                                    >
                                        {name} {" "}
                                        {/*{((percent ?? 0) * 100).toFixed(0)}%*/}
                                    </text>
                                )}
                                isAnimationActive
                                animationDuration={900}
                                animationEasing="ease-out"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={entry.color}
                                        className="cursor-pointer transition-all duration-300 hover:opacity-800"
                                    />
                                ))}

                                {/* CENTER LABEL */}
                                <Label
                                    position="center"
                                    content={() => (
                                        <g>
                                            <text
                                                x="50%"
                                                y="45%"
                                                textAnchor="middle"
                                                className="fill-muted-foreground text-[12px]"
                                            >
                                                Transactions
                                            </text>

                                            <text
                                                x="50%"
                                                y="56%"
                                                textAnchor="middle"
                                                className="fill-foreground text-[30px] font-bold"
                                            >
                                                {total}
                                            </text>
                                        </g>
                                    )}
                                />
                            </Pie>

                            <Tooltip
                                cursor={{
                                    fill: "rgba(255,255,255,0.04)",
                                }}
                                formatter={(value, name) => [
                                    `${value} transactions`,
                                    name,
                                ]}
                                contentStyle={{
                                    borderRadius: "16px",
                                    border: "1px solid hsl(var(--border))",
                                    background:
                                        "hsl(var(--background) / 0.95)",
                                    backdropFilter: "blur(8px)",
                                    fontSize: "12px",
                                    padding: "10px 14px",
                                    boxShadow:
                                        "0 10px 30px rgba(0,0,0,0.12)",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* LEGEND */}
            <div className="mt-5 grid grid-cols-2 gap-3">

                {data.map((item) => {
                    const percent =
                        total > 0
                            ? ((item.value / total) * 100).toFixed(0)
                            : 0;

                    return (
                        <div
                            key={item.name}
                            className="
                                group relative overflow-hidden
                                rounded-2xl border bg-background/60
                                px-4 py-3
                                shadow-sm
                                transition-all duration-300
                                hover:-translate-y-1
                                hover:shadow-md
                            "
                        >
                            {/* accent */}
                            <div
                                className="absolute left-0 top-0 h-full w-1"
                                style={{
                                    backgroundColor: item.color,
                                }}
                            />

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <span
                                        className="h-3 w-3 rounded-full ring-4 ring-background"
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                    />

                                    <div>
                                        <p className="text-sm font-semibold">
                                            {item.name}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {percent}% of total
                                        </p>
                                    </div>

                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-bold">
                                        {item.value}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        payments
                                    </p>
                                </div>

                            </div>
                        </div>
                    );
                })}

            </div>

        </SectionCard>
    );
}