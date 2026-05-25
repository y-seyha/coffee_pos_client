"use client";

import { useEffect, useState } from "react";

import { variantGroupApi } from "@/lib/api/variant-management.api";
import { VariantGroup } from "@/types";

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

export default function VariantGroupPage() {
    const [data, setData] = useState<VariantGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editItem, setEditItem] = useState<VariantGroup | null>(null);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [sortOrder, setSortOrder] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await variantGroupApi.getAll();
            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        setSaving(true);

        try {
            if (editItem) {
                await variantGroupApi.update(editItem.id, {
                    name,
                    code,
                    sort_order: sortOrder,
                });

                toast.success("Variant group updated");
            } else {
                await variantGroupApi.create({
                    name,
                    code,
                    sort_order: sortOrder,
                });

                toast.success("Variant group created");
            }

            setOpen(false);
            setEditItem(null);
            setName("");
            setCode("");
            setSortOrder(0);
            fetchData();

        } catch (err: any) {
            toast.error("Failed", {
                description:
                    err?.response?.data?.message || "Something went wrong",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await variantGroupApi.remove(deleteId);
            toast.success("Deleted successfully");
            setConfirmOpen(false);
            setDeleteId(null);
            fetchData();
        } catch (err: any) {
            toast.error("Delete failed", {
                // description: err?.response?.data?.message,
            });
        }
    };

    return (
        <div className="p-6 space-y-4">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Variant Groups</h1>

                <Button
                    onClick={() => {
                        setEditItem(null);
                        setName("");
                        setCode("");
                        setSortOrder(0);
                        setOpen(true);
                    }}
                >
                    + Add Group
                </Button>
            </div>

            {/* TABLE */}
            <AppTable>
                <AppTableHeader>
                    <div>ID</div>
                    <div>Name</div>
                    <div>Code</div>
                    <div>Options</div>
                    <div>Actions</div>
                </AppTableHeader>

                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <AppTableRow key={i} index={i}>
                            <AppTableCell>
                                <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
                            </AppTableCell>

                            <AppTableCell>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </AppTableCell>

                            <AppTableCell>
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                            </AppTableCell>

                            <AppTableCell>
                                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                            </AppTableCell>

                            <AppTableCell>
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </AppTableCell>
                        </AppTableRow>
                    ))
                ) : (
                    data.map((g, i) => (
                        <AppTableRow key={g.id} index={i}>
                            <AppTableCell>{g.id}</AppTableCell>
                            <AppTableCell>{g.name}</AppTableCell>
                            <AppTableCell>{g.code}</AppTableCell>
                            <AppTableCell>{g.options?.length ?? 0}</AppTableCell>

                            <AppTableCell>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditItem(g);
                                            setName(g.name);
                                            setCode(g.code);
                                            setSortOrder(g.sort_order);
                                            setOpen(true);
                                        }}
                                    >
                                        <Pencil className="w-4 h-4 text-blue-500" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setDeleteId(g.id);
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

            {/* MODAL */}
            <AppModal
                open={open}
                title={editItem ? "Edit Variant Group" : "Create Variant Group"}
                onClose={() => setOpen(false)}
            >
                <div className="space-y-4">

                    {/* NAME */}
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            placeholder="e.g. Color, Size, Material"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* CODE */}
                    <div>
                        <label className="text-sm font-medium">Code</label>
                        <Input
                            placeholder="e.g. COLOR, SIZE, MATERIAL"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>

                    {/* SORT ORDER */}
                    <div>
                        <label className="text-sm font-medium">Sort Order</label>
                        <Input
                            type="number"
                            placeholder="e.g. 1, 2, 3"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(Number(e.target.value))}
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>

                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </div>

                </div>
            </AppModal>

            {/* CONFIRM */}
            <ConfirmModal
                open={confirmOpen}
                title="Delete Variant Group?"
                description="This will also affect related options."
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}