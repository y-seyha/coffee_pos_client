"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">

            <div className="text-center max-w-md space-y-6">
                <h1 className="text-8xl font-extrabold text-gray-900 tracking-tight">
                    404
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800">
                    Page not found
                </h2>
                <p className="text-gray-500 leading-relaxed">
                    The page you’re looking for doesn’t exist or has been moved.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                    <Link
                        href="/"
                        className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
                    >
                        Go Back
                    </button>

                </div>

            </div>
        </div>
    );
}