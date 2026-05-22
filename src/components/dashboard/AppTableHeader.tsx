import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    cols?: number;
};

export function AppTableHeader({ children, cols = 5 }: Props) {
    return (
        <div
            className="grid bg-muted text-sm font-semibold px-4 py-3"
            style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
        >
            {children}
        </div>
    );
}