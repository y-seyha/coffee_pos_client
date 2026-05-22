"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import { useMemo, useState, useEffect } from "react";

import {
    LayoutDashboard,
    BarChart3,
    ShoppingCart,
    Package,
    FolderKanban,
    Boxes,
    Tags,
    Users,
    ShieldCheck,
    KeyRound,
    Receipt,
    CreditCard,
    TicketPercent,
    Settings,
    DollarSign,
    Truck,
    Percent,
    LogOut,
    Menu,
    ChevronDown,
} from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type SidebarItem = {
    title: string;
    href?: string;
    icon?: any;
    children?: SidebarItem[];
};

const sidebarData: SidebarItem[] = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        children: [
            { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
            // { title: "Sales Summary", href: "/admin/sales-summary", icon: ShoppingCart },
            // { title: "Recent Orders", href: "/admin/recent-orders", icon: Receipt },
        ],
    },
    {
        title: "Catalog",
        icon: Package,
        children: [
            { title: "Categories", href: "/admin/categories", icon: FolderKanban },
            { title: "Products", href: "/admin/products", icon: Boxes },
            { title: "Variant Groups", href: "/admin/variant-groups", icon: Tags },
            { title: "Variant Options", href: "/admin/variant-options", icon: Tags },
        ],
    },
    {
        title: "Users & Access",
        icon: Users,
        children: [
            { title: "Users", href: "/admin/users", icon: Users },
            { title: "Roles", href: "/admin/roles", icon: ShieldCheck },
            { title: "Permissions", href: "/admin/permissions", icon: KeyRound },
        ],
    },
    {
        title: "Sales",
        icon: DollarSign,
        children: [
            { title: "Orders", href: "/admin/orders", icon: Receipt },
            { title: "Payments", href: "/admin/payments", icon: CreditCard },
            { title: "Coupons", href: "/admin/discounts", icon: TicketPercent },
        ],
    },
    {
        title: "Settings",
        icon: Settings,
        children: [
            { title: "Store Settings", href: "/admin/store-settings", icon: Settings },
            { title: "Currency", href: "/admin/currency", icon: DollarSign },
            { title: "Shipping", href: "/admin/shipping", icon: Truck },
            { title: "Tax", href: "/admin/tax", icon: Percent },
        ],
    },
];

function SidebarContent() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (href?: string) => pathname === href;

    const isSectionActive = (section: SidebarItem) =>
        section.children?.some((item) => item.href === pathname);

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialState: Record<string, boolean> = {};

        sidebarData.forEach((section) => {
            initialState[section.title] = isSectionActive(section) || section.title === "Dashboard";
        });

        setOpenSections(initialState);
    }, [pathname]);

    useEffect(() => {
        if (pathname === "/admin") {
            router.replace("/admin/analytics");
        }
    }, [pathname, router]);

    const toggleSection = (title: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <div className="flex h-full flex-col bg-background">
            {/* HEADER */}
            <div className="border-b px-6 py-5">
                <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>

            {/* MENU */}
            <ScrollArea className="flex-1 px-3 py-4">
                <div className="space-y-3">
                    {sidebarData.map((section) => {
                        const open = openSections[section.title];
                        const activeSection = isSectionActive(section);

                        return (
                            <div key={section.title} className="space-y-1">
                                {/* SECTION HEADER */}
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition",
                                        activeSection
                                            ? "bg-muted"
                                            : "hover:bg-muted"
                                    )}
                                >
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        {section.icon && (
                                            <section.icon className="h-4 w-4" />
                                        )}
                                        <span>{section.title}</span>
                                    </div>

                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 transition-transform duration-300",
                                            open && "rotate-180"
                                        )}
                                    />
                                </button>

                                <div
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        open
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden ml-3 space-y-1 border-l pl-3">
                                        {section.children?.map((item) => (
                                            <Link key={item.title} href={item.href || "#"}>
                                                <div
                                                    className={cn(
                                                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                                                        "hover:bg-muted",
                                                        isActive(item.href) &&
                                                        "bg-primary text-primary-foreground shadow-sm"
                                                    )}
                                                >
                                                    {item.icon && (
                                                        <item.icon className="h-4 w-4" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* LOGOUT */}
            <div className="border-t p-3">
                <Button
                    variant="destructive"
                    className="w-full justify-start gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}

export function AdminSidebar() {
    return (
        <>
            {/* MOBILE */}
            <div className="flex items-center border-b px-4 py-3 lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="w-[300px] p-0">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* DESKTOP */}
            <aside className="hidden h-screen w-[280px] border-r lg:block">
                <SidebarContent />
            </aside>
        </>
    );
}