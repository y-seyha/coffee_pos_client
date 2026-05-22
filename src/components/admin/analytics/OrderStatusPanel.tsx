"use client";

import { SectionCard } from "./SectionCard";

type Props = {
    data: {
        pending: number;
        processing: number;
        completed: number;
        cancelled: number;
    };
};

export function OrderStatusPanel({ data }: Props) {

    const total =
        data.pending +
        data.processing +
        data.completed +
        data.cancelled;

    const getPercent = (value: number) => {
        if (total === 0) return 0;

        return Math.round((value / total) * 100);
    };

    const statuses = [
        {label: "Pending", value: data.pending, color: "bg-yellow-500",},
        {label: "Processing", value: data.processing, color: "bg-blue-500",},
        {label: "Completed", value: data.completed, color: "bg-green-500",},
        {label: "Cancelled",value: data.cancelled, color: "bg-red-500",},
    ];

    return (
        <SectionCard title="Order Status">

            <div className="space-y-5">

                {statuses.map((status) => {

                    const percent =
                        getPercent(status.value);

                    return (
                        <div
                            key={status.label}
                            className="space-y-1"
                        >

                            {/* HEADER */}
                            <div className="flex items-center justify-between text-sm">

                                <div className="flex items-center gap-2">

                                    <div
                                        className={`w-3 h-3 rounded-full ${status.color}`}
                                    />

                                    <span className="font-medium">
                                        {status.label}
                                    </span>

                                </div>

                                <div className="text-muted-foreground">
                                    {status.value} ({percent}%)
                                </div>

                            </div>

                            {/* PROGRESS BAR */}
                            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">

                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${status.color}`}
                                    style={{
                                        width: `${percent}%`,
                                    }}
                                />

                            </div>

                        </div>
                    );
                })}

            </div>

        </SectionCard>
    );
}