import { toast } from "sonner";

export const successToast = (
    title: string,
    desc?: string,
    duration = 5000
) => {
    toast.custom(
        (t: any) => (
            <div
                className={`relative w-[320px] rounded-2xl border border-green-100 bg-white shadow-xl overflow-hidden transition-all ${
                    t.visible
                        ? "animate-in fade-in slide-in-from-top-2"
                        : "animate-out fade-out"
                }`}
            >
                {/* HEADER GLOW */}
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />

                {/* CLOSE BUTTON */}
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute top-2 right-2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                >
                    ✕
                </button>

                {/* CONTENT */}
                <div className="flex gap-3 px-4 py-4 pr-10">
                    {/* ICON BADGE */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm">
                        ✓
                    </div>

                    <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">
                            {title}
                        </div>

                        {desc && (
                            <div className="mt-1 text-xs leading-relaxed text-gray-500">
                                {desc}
                            </div>
                        )}
                    </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="absolute bottom-0 left-0 h-[3px] w-full bg-green-50">
                    <div
                        className="h-full bg-green-500"
                        style={{
                            width: "100%",
                            animation: `toastProgress ${duration}ms linear forwards`,
                        }}
                    />
                </div>
            </div>
        ),
        { duration }
    );
};