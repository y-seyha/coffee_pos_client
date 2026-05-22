import {Button} from "@/components/ui/button";

type FilterType = "Today" | "Month";

type Props = {
    active: FilterType;
    onChange: (value: FilterType) => void;
};

const filters: FilterType[] = ["Today", "Month"];

export function ChartHeader({ active, onChange }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
                <Button
                    key={f}
                    variant={active === f ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange(f)}
                    className="rounded-xl"
                >
                    {f}
                </Button>
            ))}
        </div>
    );
}