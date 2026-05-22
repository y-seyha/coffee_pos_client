import { ReactNode } from "react";

export function AppTableCell({ children }: { children: ReactNode }) {
    return (
        <div className="min-w-0">
            {children}
        </div>
    );
}