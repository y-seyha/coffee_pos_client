import { toast } from "sonner";

export const successToast = (
    title: string,
    desc?: string,
    duration = 5000
) => {
    toast.custom(
        (t: any) => (
            <div
                className={`bg-white text-black rounded-xl shadow-lg overflow-hidden min-w-[260px] relative ${
                    t.visible ? "animate-in fade-in" : "animate-out fade-out"
                }`}
            >
                {/* CLOSE */}
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-black"
                >
                    ✕
                </button>

                {/* CONTENT */}
                <div className="flex items-start gap-2 px-4 py-3 pr-8">
                    {/* ICON (keep green) */}
                    <div className="text-green-500 mt-0.5 font-bold">✔</div>

                    <div>
                        <div className="font-semibold text-black">{title}</div>

                        {desc && (
                            <div className="text-sm text-gray-600">{desc}</div>
                        )}
                    </div>
                </div>

                {/* PROGRESS BAR */}
                <div
                    className="absolute bottom-0 left-0 h-[3px] bg-green-500"
                    style={{
                        width: "100%",
                        animation: `toastProgress ${duration}ms linear forwards`,
                    }}
                />
            </div>
        ),
        { duration }
    );
};