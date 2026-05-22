"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

type Props = {
    data: { name: string; value: number }[];
};

const COLORS = ["#6366F1", "#22C55E", "#FACC15", "#F97316", "#06B6D4"];

const renderLabel = (props: any) => {
    const { percent } = props;
    if (!percent || percent < 0.06) return "";
    return `${(percent * 100).toFixed(0)}%`;
};

export function SalesPieChart({ data }: Props) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="relative w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        innerRadius={70}
                        paddingAngle={3}
                        label={renderLabel}
                        labelLine={false}
                        stroke="none"
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>

            {/* PERFECT CENTER ALIGN */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-xs text-muted-foreground">
                    Total Sales
                </p>
                <p className="text-xl font-bold">{total}</p>
            </div>
        </div>
    );
}