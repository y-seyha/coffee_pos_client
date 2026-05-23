"use client";

import { useEffect, useState } from "react";
import { paymentApi } from "@/lib/api/payment.api";


import { DollarSign, CreditCard, XCircle, RotateCcw } from "lucide-react";
import {toNumber} from "@/helper";

function Card({
                  title,
                  value,
                  icon: Icon,
              }: {
    title: string;
    value: string | number;
    icon: any;
}) {
    return (
        <div className="p-5 rounded-2xl border bg-white shadow-sm flex justify-between items-center">
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <Icon className="w-6 h-6 text-gray-500" />
        </div>
    );
}

export function PaymentKpi() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        paymentApi.getPaymentDashboard().then(setData);
    }, []);

    if (!data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card
                    title="Revenue"
                    value={`$${toNumber(data.revenue).toFixed(2)}`}
                    icon={DollarSign}
                />

                <Card
                    title="Today Payments"
                    value={toNumber(data.today_payments)}
                    icon={CreditCard}
                />

                <Card
                    title="Failed"
                    value={data.failed_payments}
                    icon={XCircle}
                />

                <Card
                    title="Refunded"
                    value={data.refunded_payments}
                    icon={RotateCcw}
                />
            </div>
        </div>
    );
}