"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/admin/analytics");
        }, 800);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-center space-y-3">

                {/* LOADING SPINNER */}
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

                {/* TEXT */}
                <p className="text-sm text-muted-foreground">
                    Redirecting to dashboard...
                </p>

            </div>
        </div>
    );
}