"use client";

import { AlertCircle } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <AlertCircle className="h-6 w-6 mb-2" />
            <p className="text-sm">{message}</p>
        </div>
    );
}