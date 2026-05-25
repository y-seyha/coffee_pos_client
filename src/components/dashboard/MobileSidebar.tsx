"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";

import { SidebarContent } from "@/components/admin/AdminSidebar";

export function MobileSidebar() {
    return (
        <div className="lg:hidden flex items-center border-b px-4 py-3">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-[300px] p-0">
                    <SheetTitle className="sr-only">
                        Admin Navigation
                    </SheetTitle>

                    <SidebarContent />
                </SheetContent>
            </Sheet>
        </div>
    );
}