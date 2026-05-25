"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
    LayoutDashboard,
    BarChart3,
    Package,
    FolderKanban,
    Boxes,
    Tags,
    Users,
    ShieldCheck,
    Receipt,
    CreditCard,
    TicketPercent,
    DollarSign,
    LogOut,
    Menu,
    ChevronDown,
} from "lucide-react";

import {
    Sheet,
    SheetContent, SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

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
            {
                title: "Analytics",
                href: "/admin/analytics",
                icon: BarChart3,
            },
        ],
    },
    {
        title: "Catalog",
        icon: Package,
        children: [
            {
                title: "Categories",
                href: "/admin/categories",
                icon: FolderKanban,
            },
            {
                title: "Products",
                href: "/admin/products",
                icon: Boxes,
            },
            {
                title: "Variant Groups",
                href: "/admin/variant-groups",
                icon: Tags,
            },
            {
                title: "Variant Options",
                href: "/admin/variant-options",
                icon: Tags,
            },
        ],
    },
    {
        title: "Users & Access",
        icon: Users,
        children: [
            {
                title: "Users",
                href: "/admin/users",
                icon: Users,
            },
            {
                title: "Roles",
                href: "/admin/roles",
                icon: ShieldCheck,
            },
        ],
    },
    {
        title: "Sales",
        icon: DollarSign,
        children: [
            {
                title: "Orders",
                href: "/admin/orders",
                icon: Receipt,
            },
            {
                title: "Payments",
                href: "/admin/payments",
                icon: CreditCard,
            },
            {
                title: "Coupons",
                href: "/admin/discounts",
                icon: TicketPercent,
            },
        ],
    },
];

export function SidebarContent() {
    const pathname = usePathname();
    const router = useRouter();

    const { logout, user } = useAuth();

    const isActive = (href?: string) => pathname === href;

    const isSectionActive = (section: SidebarItem) =>
        section.children?.some((item) => item.href === pathname);

    // ALL OPEN BY DEFAULT
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        () =>
            Object.fromEntries(
                sidebarData.map((section) => [section.title, true])
            )
    );

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

            {/* PROFILE HEADER */}
            <div className="border-b px-4 py-5">

                <div className="flex items-center gap-3">

                    <Avatar className="h-11 w-11 border shadow-sm">
                        <AvatarFallback className="font-semibold text-sm uppercase">
                            {user?.email?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">

                        {/* EMAIL */}
                        <p className="truncate text-sm font-semibold">
                            {user?.email || "Loading..."}
                        </p>

                        {/* ROLE */}
                        <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
                            {typeof user?.role === "string"
                                ? user.role
                                : user?.role?.name || "USER"}
                        </p>

                    </div>

                </div>

            </div>

            {/* MENU */}
            <ScrollArea className="flex-1 px-3 py-4">

                <div className="space-y-3">

                    {sidebarData.map((section) => {
                        const open = openSections[section.title];
                        const activeSection = isSectionActive(section);

                        return (
                            <div
                                key={section.title}
                                className="space-y-1"
                            >

                                {/* SECTION HEADER */}
                                <button
                                    onClick={() =>
                                        toggleSection(section.title)
                                    }
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
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

                                {/* DROPDOWN */}
                                <div
                                    className={cn(
                                        "grid overflow-hidden transition-all duration-300 ease-in-out",
                                        open
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    )}
                                >

                                    <div className="overflow-hidden ml-3 space-y-1 border-l pl-3">

                                        {section.children?.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href || "#"}
                                            >

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
                    className="w-full flex items-center justify-center gap-2"
                    onClick={logout}
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
                        <SheetTitle className="sr-only">
                            Admin Sidebar Navigation
                        </SheetTitle>

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