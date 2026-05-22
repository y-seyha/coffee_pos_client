import { ReactNode } from "react";


export function AppTable({ children }: { children: ReactNode }) {
    return (
        <div className="w-full rounded-xl border overflow-hidden">
            {children}
        </div>
    );
}