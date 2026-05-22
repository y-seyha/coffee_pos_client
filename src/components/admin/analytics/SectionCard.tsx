"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

type Props = {
    title: string;
    rightAction?: ReactNode;
    children: ReactNode;
};

export function SectionCard({ title, rightAction, children }: Props) {
    return (
        <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                    {title}
                </CardTitle>
                {rightAction}
            </CardHeader>

            <CardContent>{children}</CardContent>
        </Card>
    );
}