import { ReactNode } from "react";

export function AppTableHeader({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-5 bg-muted text-sm font-semibold px-4 py-3">
            {children}
        </div>
    );
}