import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
            <div className="text-center max-w-md space-y-6">
                {/* ICON / CODE */}
                <div className="text-6xl">🚫</div>
                <h1 className="text-4xl font-bold text-gray-900">
                    403 - Unauthorized
                </h1>
                <h2 className="text-lg font-semibold text-gray-700">
                    Access denied
                </h2>
                <p className="text-gray-500 leading-relaxed">
                    You don’t have permission to access this page.
                    Please contact an administrator if you think this is a mistake.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                    <Link
                        href="/"
                        className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/auth/login"
                        className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
                    >
                        Login Again
                    </Link>
                </div>

            </div>
        </div>
    );
}