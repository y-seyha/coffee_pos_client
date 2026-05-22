import { ReactNode } from "react";
import {AdminSidebar} from "@/components/admin/AdminSidebar";


type Props = {
    children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
    return (
        <div className="h-screen bg-muted/40 flex overflow-hidden">

            {/* SIDEBAR */}
            <aside className="h-screen sticky top-0">
                <AdminSidebar />
            </aside>

            {/* CONTENT */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>

        </div>
    );
}