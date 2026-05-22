import { ReactNode } from "react";

export function AppTableCell({ children }: { children: ReactNode }) {
    return <div className="truncate">{children}</div>;
}