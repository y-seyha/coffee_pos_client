"use client";

import { useEffect, useState } from "react";

import {
    variantOptionApi,
    variantGroupApi,
} from "@/lib/api/variant-management.api";

import { VariantOption, VariantGroup } from "@/types";

import { AppTable } from "@/components/dashboard/AppTable";
import { AppTableHeader } from "@/components/dashboard/AppTableHeader";
import { AppTableRow } from "@/components/dashboard/AppTableRow";
import { AppTableCell } from "@/components/dashboard/AppTableCell";
import { AppModal } from "@/components/dashboard/AppModal";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const initialForm = {
    name: "",
    groupId: null as number | null,
    priceType: "ADD" as "ADD" | "SET" | "PERCENT",
    priceAdjustment: 0,
    isDefault: false,
    isActive: true,
    sortOrder: 0,
};

export default function VariantOptionPage() {
    const [data, setData] = useState<VariantOption[]>([]);
    const [groups, setGroups] = useState<VariantGroup[]>([]);

    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editItem, setEditItem] = useState<VariantOption | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [form, setForm] = useState(initialForm);
    const [sortBy, setSortBy] = useState<"type" | "active" | "sort">("sort");
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await variantOptionApi.getAll();
            setData(res.data);

            const g = await variantGroupApi.getAll();
            setGroups(g.data);
        } catch (err) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setEditItem(null);
        setForm(initialForm);
    };

    const openCreate = () => {
        resetForm();
        setOpen(true);
    };

    const openEdit = (o: VariantOption) => {
        setEditItem(o);

        setForm({
            name: o.name,
            groupId: o.variant_group_id,
            priceType: o.price_adjustment_type ?? "ADD",
            priceAdjustment: Number(o.price_adjustment ?? 0),
            isDefault: o.is_default,
            isActive: o.is_active,
            sortOrder: o.sort_order,
        });

        setOpen(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.groupId) {
            toast.error("Missing required fields");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                name: form.name,
                variant_group_id: Number(form.groupId),
                price_adjustment_type: form.priceType,
                price_adjustment: form.priceAdjustment,
                is_default: form.isDefault,
                is_active: form.isActive,
                sort_order: form.sortOrder,
            };

            if (editItem) {
                await variantOptionApi.update(editItem.id, payload);
                toast.success("Option updated");
            } else {
                await variantOptionApi.create(payload);
                toast.success("Option created");
            }

            setOpen(false);
            resetForm();
            fetchData();
        } catch (err: any) {
            toast.error("Failed", {
                description: err?.response?.data?.message,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        await variantOptionApi.remove(deleteId);

        toast.success("Deleted");

        setConfirmOpen(false);
        setDeleteId(null);
        fetchData();
    };

    const typeBadge = (type?: string) => {
        const base = "px-2 py-1 rounded-full text-xs font-medium";
        switch (type) {
            case "ADD":
                return `${base} bg-green-100 text-green-700`;
            case "SET":
                return `${base} bg-blue-100 text-blue-700`;
            case "PERCENT":
                return `${base} bg-purple-100 text-purple-700`;
            default:
                return `${base} bg-gray-100 text-gray-700`;
        }
    };

    const statusBadge = (active: boolean) =>
        active
            ? "px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"
            : "px-2 py-1 rounded-full text-xs bg-red-100 text-red-700";

    const yesNoBadge = (val: boolean) =>
        val
            ? "px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
            : "px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600";


    const sortedData = [...data].sort((a, b) => {
        if (sortBy === "sort") {
            return a.sort_order - b.sort_order;
        }

        if (sortBy === "active") {
            return Number(b.is_active) - Number(a.is_active);
        }

        if (sortBy === "type") {
            return (a.price_adjustment_type ?? "").localeCompare(
                b.price_adjustment_type ?? ""
            );
        }

        return 0;
    });

    return (
        <div className="p-6 space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-semibold">Variant Options</h1>

                    <select
                        className="mt-2 border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                    >
                        <option value="sort">Sort by Sort Order</option>
                        <option value="type">Sort by Type</option>
                        <option value="active">Sort by Active</option>
                    </select>
                </div>

                <Button onClick={openCreate}>+ Add Option</Button>
            </div>

            {/* TABLE */}
            <AppTable>
                <AppTableHeader cols={10}>
                    <div>No.</div>
                    <div>ID</div>
                    <div>Name</div>
                    <div>Group</div>
                    <div>Price</div>
                    <div>Type</div>
                    <div>Default</div>
                    <div>Active</div>
                    <div>Sort</div>
                    <div>Actions</div>
                </AppTableHeader>

                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <AppTableRow key={i} index={i} cols={10}>
                            {Array.from({ length: 10 }).map((_, j) => (
                                <AppTableCell key={j}>
                                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                                </AppTableCell>
                            ))}
                        </AppTableRow>
                    ))
                ) : (
                    sortedData.map((o, i) => (
                        <AppTableRow key={o.id} index={i} cols={10}>
                            <AppTableCell>{i + 1}</AppTableCell>
                            <AppTableCell>{o.id}</AppTableCell>
                            <AppTableCell>{o.name}</AppTableCell>
                            <AppTableCell>{o.variant_group?.name}</AppTableCell>
                            <AppTableCell>{o.price_adjustment}</AppTableCell>

                            <AppTableCell>
                <span className={typeBadge(o.price_adjustment_type)}>
                    {o.price_adjustment_type}
                </span>
                            </AppTableCell>

                            <AppTableCell>
                <span className={yesNoBadge(o.is_default)}>
                    {o.is_default ? "Yes" : "No"}
                </span>
                            </AppTableCell>

                            <AppTableCell>
                <span className={statusBadge(o.is_active)}>
                    {o.is_active ? "Active" : "Inactive"}
                </span>
                            </AppTableCell>

                            <AppTableCell>{o.sort_order}</AppTableCell>

                            <AppTableCell>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(o)}>
                                        <Pencil className="w-4 h-4 text-blue-500" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setDeleteId(o.id);
                                            setConfirmOpen(true);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </AppTableCell>
                        </AppTableRow>
                    ))
                )}
            </AppTable>

            <AppModal
                open={open}
                title={editItem ? "Edit Option" : "Create Option"}
                onClose={() => {
                    setOpen(false);
                    resetForm();
                }}
            >
                <div className="space-y-4">

                    <div>
                        <label className="text-sm font-medium">Option Name</label>
                        <Input
                            placeholder="e.g. Small, Medium, Large"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Variant Group</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={form.groupId ?? ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    groupId: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                })
                            }
                        >
                            <option value="">Select group</option>
                            {groups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Price Type</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={form.priceType}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    priceType: e.target.value as any,
                                })
                            }
                        >
                            <option value="ADD">Add</option>
                            <option value="SET">Set</option>
                            <option value="PERCENT">Percent</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Price Adjustment</label>
                        <Input
                            type="number"
                            value={form.priceAdjustment}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    priceAdjustment: Number(e.target.value),
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Sort Order</label>
                        <Input
                            type="number"
                            value={form.sortOrder}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    sortOrder: Number(e.target.value),
                                })
                            }
                        />
                    </div>

                    <div className="flex gap-6 text-sm">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.isDefault}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        isDefault: e.target.checked,
                                    })
                                }
                            />
                            Default Option
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        isActive: e.target.checked,
                                    })
                                }
                            />
                            Active
                        </label>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={saving || !form.name || !form.groupId}
                    >
                        {saving ? "Saving..." : "Save Option"}
                    </Button>
                </div>
            </AppModal>

            {/* DELETE */}
            <ConfirmModal
                open={confirmOpen}
                title="Delete Option?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}