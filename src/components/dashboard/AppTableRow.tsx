import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
    index: number;
    children: ReactNode;
    className?: string;
    cols?: number;
};

export function AppTableRow({
                                index,
                                children,
                                className,
                                cols = 5,
                            }: Props) {
    return (
        <div
            className={cn(
                "grid px-4 py-3 text-sm items-center transition relative z-0",
                index % 2 === 0 ? "bg-white" : "bg-muted/40",
                "hover:bg-muted/70",
                className
            )}
            style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
        >
            {children}
        </div>
    );
}