"use client";

import { Card, CardContent } from "@/components/ui/card";

import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
    title: string;
    value: string | number;
    change?: string;
    icon: LucideIcon;
    variant?: "default" | "success" | "danger";
};

export function StatCard({
                             title,
                             value,
                             change,
                             icon: Icon,
                             variant = "default",
                         }: StatCardProps) {

    return (
        <Card
            className={cn(
                "rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            )}
        >

            <CardContent className="p-5">

                <div className="flex items-start justify-between">

                    {/* LEFT */}
                    <div className="space-y-2">

                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>

                        <h3 className="text-3xl font-bold tracking-tight">
                            {value}
                        </h3>

                        {change && (
                            <div
                                className={cn(
                                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",

                                    variant === "success" &&
                                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",

                                    variant === "danger" &&
                                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",

                                    variant === "default" &&
                                    "bg-muted text-muted-foreground"
                                )}
                            >
                                {change}
                            </div>
                        )}

                    </div>

                    {/* RIGHT */}
                    <div
                        className={cn(
                            "flex h-14 w-14 items-center justify-center rounded-2xl",

                            variant === "success" &&
                            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",

                            variant === "danger" &&
                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",

                            variant === "default" &&
                            "bg-muted text-foreground"
                        )}
                    >

                        <Icon className="h-6 w-6" />

                    </div>

                </div>

            </CardContent>

        </Card>
    );
}