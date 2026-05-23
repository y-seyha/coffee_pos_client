"use client";

import { useEffect, useMemo, useState } from "react";
import { discountApi } from "@/lib/api/discount.api";
import { Discount } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppModal } from "@/components/dashboard/AppModal";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";
import { AppTable } from "@/components/dashboard/AppTable";
import { AppTableHeader } from "@/components/dashboard/AppTableHeader";
import { AppTableRow } from "@/components/dashboard/AppTableRow";
import { AppTableCell } from "@/components/dashboard/AppTableCell";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Plus,
    Pencil,
    Trash2,
    MoreHorizontal,
    TicketPercent,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";

export default function DiscountDashboardPage() {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editItem, setEditItem] = useState<Discount | null>(null);
    const [search, setSearch] = useState("");

    const [form, setForm] = useState({
        name: "",
        type: "PERCENTAGE",
        value: "",
    });

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchDiscounts = async () => {
        try {
            setLoading(true);
            const res = await discountApi.getAll();
            setDiscounts(res);
        } catch {
            toast.error("Failed to load discounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const filteredDiscounts = useMemo(() => {
        return discounts.filter((d) =>
            d.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [discounts, search]);

    const activeDiscounts = useMemo(
        () => discounts.filter((d) => d.is_active).length,
        [discounts]
    );

    const inactiveDiscounts = useMemo(
        () => discounts.filter((d) => !d.is_active).length,
        [discounts]
    );

    const openCreate = () => {
        setEditItem(null);
        setForm({ name: "", type: "PERCENTAGE", value: "" });
        setOpen(true);
    };

    const openEdit = (d: Discount) => {
        setEditItem(d);
        setForm({
            name: d.name,
            type: d.type,
            value: String(d.value),
        });
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            setActionLoading(editItem ? "update" : "create");

            const payload = {
                name: form.name,
                type: form.type as "PERCENTAGE" | "FIXED",
                value: Number(form.value),
            };

            if (editItem) {
                await discountApi.update(editItem.id, payload);
                toast.success("Discount updated");
            } else {
                await discountApi.create(payload);
                toast.success("Discount created");
            }

            setOpen(false);
            fetchDiscounts();
        } catch {
            toast.error("Failed to save discount");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            setActionLoading("delete");

            await discountApi.delete(deleteId);
            toast.success("Discount deleted");
            fetchDiscounts();
        } catch {
            toast.error("Delete failed");
        } finally {
            setDeleteId(null);
            setConfirmOpen(false);
            setActionLoading(null);
        }
    };

    const toggleStatus = async (id: number) => {
        try {
            setActionLoading(`toggle-${id}`);

            await discountApi.toggle(id);
            toast.success("Status updated");
            fetchDiscounts();
        } catch {
            toast.error("Failed to toggle status");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <TicketPercent className="w-6 h-6" />
                        Discount Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage discount campaigns and promotional pricing
                    </p>
                </div>

                <Button onClick={openCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Discount
                </Button>
            </div>

            {/* SEARCH */}
            <div className="bg-white border rounded-2xl p-4">
                <Input
                    placeholder="Search discount"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border rounded-2xl p-5">
                    <p>Total Discounts</p>
                    <h2 className="text-3xl font-bold">{discounts.length}</h2>
                </div>

                <div className="bg-white border rounded-2xl p-5">
                    <p>Active</p>
                    <h2 className="text-3xl font-bold text-green-600">
                        {activeDiscounts}
                    </h2>
                </div>

                <div className="bg-white border rounded-2xl p-5">
                    <p>Inactive</p>
                    <h2 className="text-3xl font-bold text-red-600">
                        {inactiveDiscounts}
                    </h2>
                </div>
            </div>

            {/* TABLE */}
            <AppTable>

                <AppTableHeader cols={7}>
                    <div>ID</div>
                    <div>Name</div>
                    <div>Type</div>
                    <div>Value</div>
                    <div>Status</div>
                    <div>Created</div>
                    <div>Actions</div>
                </AppTableHeader>

                {loading ? (
                    <div className="p-6 text-center text-gray-500">
                        Loading...
                    </div>
                ) : filteredDiscounts.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No discounts found
                    </div>
                ) : (
                    filteredDiscounts.map((d, i) => (
                        <AppTableRow key={d.id} index={i} cols={7}>

                            <AppTableCell>#{d.id}</AppTableCell>

                            <AppTableCell>{d.name}</AppTableCell>

                            <AppTableCell>{d.type}</AppTableCell>

                            <AppTableCell>
                                {d.type === "PERCENTAGE"
                                    ? `${d.value}%`
                                    : `$${d.value}`}
                            </AppTableCell>

                            <AppTableCell>
                                <span
                                    className={
                                        d.is_active
                                            ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                                            : "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs"
                                    }
                                >
                                    {d.is_active ? "Active" : "Inactive"}
                                </span>
                            </AppTableCell>

                            <AppTableCell>
                                {new Date(d.created_at!).toLocaleDateString()}
                            </AppTableCell>

                            <AppTableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">

                                        <DropdownMenuItem onClick={() => openEdit(d)}>
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => {
                                                setDeleteId(d.id);
                                                setConfirmOpen(true);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => toggleStatus(d.id)}
                                            disabled={actionLoading === `toggle-${d.id}`}
                                        >
                                            {d.is_active ? (
                                                <ToggleRight className="w-4 h-4 mr-2" />
                                            ) : (
                                                <ToggleLeft className="w-4 h-4 mr-2" />
                                            )}

                                            Toggle Status
                                        </DropdownMenuItem>

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </AppTableCell>

                        </AppTableRow>
                    ))
                )}
            </AppTable>

            {/* MODAL */}
            <AppModal
                open={open}
                title={editItem ? "Edit Discount" : "Create Discount"}
                onClose={() => setOpen(false)}
            >
                <div className="space-y-4">

                    <Input
                        placeholder="Discount Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    <select
                        className="w-full border rounded-lg p-2"
                        value={form.type}
                        onChange={(e) =>
                            setForm({ ...form, type: e.target.value })
                        }
                    >
                        <option value="PERCENTAGE">Percentage</option>
                        <option value="FIXED">Fixed</option>
                    </select>

                    <Input
                        placeholder="Value"
                        value={form.value}
                        onChange={(e) =>
                            setForm({ ...form, value: e.target.value })
                        }
                    />

                    <Button
                        className="w-full"
                        onClick={handleSave}
                        disabled={actionLoading === "create" || actionLoading === "update"}
                    >
                        {actionLoading === "create" && "Creating..."}
                        {actionLoading === "update" && "Updating..."}
                        {!actionLoading &&
                            (editItem ? "Update Discount" : "Create Discount")}
                    </Button>

                </div>
            </AppModal>

            {/* DELETE */}
            <ConfirmModal
                open={confirmOpen}
                title="Delete discount?"
                loading={actionLoading === "delete"}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />

        </div>
    );
}