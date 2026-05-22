"use client";

import { ReactNode } from "react";

export function StatGrid({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {children}
        </div>
    );
}