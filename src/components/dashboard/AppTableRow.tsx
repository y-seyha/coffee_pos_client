import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
    index: number;
    children: ReactNode;
    className?: string;
};

export function AppTableRow({ index, children, className }: Props) {
    return (
        <div
            className={cn(
                "grid grid-cols-5 px-4 py-3 text-sm items-center transition",
                index % 2 === 0 ? "bg-white" : "bg-muted/40",
                "hover:bg-muted/70",
                className
            )}
        >
            {children}
        </div>
    );
}