"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {MobileSidebar} from "@/components/dashboard/MobileSidebar";


export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen flex bg-muted/40 overflow-hidden">

            {/* DESKTOP SIDEBAR */}
            <div className="hidden lg:block">
                <AdminSidebar />
            </div>

            {/* MAIN AREA */}
            <div className="flex flex-1 flex-col overflow-hidden">

                {/* MOBILE TOP BAR */}
                <MobileSidebar />

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}