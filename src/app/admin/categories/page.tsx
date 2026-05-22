"use client";

import { useEffect, useState } from "react";

import { AppModal } from "@/components/dashboard/AppModal";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";
import { AppTable } from "@/components/dashboard/AppTable";
import { AppTableHeader } from "@/components/dashboard/AppTableHeader";
import { AppTableRow } from "@/components/dashboard/AppTableRow";
import { AppTableCell } from "@/components/dashboard/AppTableCell";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category, categoryApi } from "@/lib/api/category.api";
import { Pencil, Trash2 } from "lucide-react";
import {toast} from "sonner";

export default function CategoryPage() {
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editItem, setEditItem] = useState<Category | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await categoryApi.getAll();
            setData(res);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async () => {
        if (!name.trim()) return;

        setSaving(true);

        try {
            if (editItem) {
                await categoryApi.update(editItem.id, { name });

                toast.success("Category updated", {
                    description: `Category "${name}" updated successfully.`,
                });
            } else {
                await categoryApi.create({ name });

                toast.success("Category created", {
                    description: `Category "${name}" created successfully.`,
                });
            }

            setOpenModal(false);
            setName("");
            setEditItem(null);
            fetchCategories();
        } catch (error: any) {
            toast.error("Operation failed", {
                description:
                    // error?.response?.data?.message ||
                    "Something went wrong while saving categories.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);

        try {
            await categoryApi.remove(deleteId);

            toast.success("Category deleted", {
                description: "The categories was removed successfully.",
            });

            setConfirmOpen(false);
            setDeleteId(null);
            fetchCategories();
        } catch (error: any) {
            toast.error("Delete failed", {
                description:
                    // error?.response?.data?.message ||
                    "Unable to delete categories.",
            });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-6 space-y-4">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Categories</h1>

                <Button
                    onClick={() => {
                        setEditItem(null);
                        setName("");
                        setOpenModal(true);
                    }}
                >
                    + Add Category
                </Button>
            </div>

            {/* TABLE */}
            <AppTable>
                <AppTableHeader>
                    <div>ID</div>
                    <div>Name</div>
                    <div>Products</div>
                    <div>Status</div>
                    <div>Actions</div>
                </AppTableHeader>

                {loading ? (
                    <div className="p-4 text-sm text-muted-foreground">
                        Loading...
                    </div>
                ) : (
                    data.map((c, i) => (
                        <AppTableRow key={c.id} index={i}>
                            <AppTableCell>{c.id}</AppTableCell>
                            <AppTableCell>{c.name}</AppTableCell>
                            <AppTableCell>
                                {c.products?.length ?? 0}
                            </AppTableCell>
                            <AppTableCell>
                                <span className="text-green-600">Active</span>
                            </AppTableCell>

                            <AppTableCell>
                                <div className="flex gap-2 items-center">

                                    {/* EDIT */}
                                    <button
                                        onClick={() => {
                                            setEditItem(c);
                                            setName(c.name);
                                            setOpenModal(true);
                                        }}
                                        className="p-2 rounded-md hover:bg-muted transition"
                                    >
                                        <Pencil className="w-4 h-4 text-blue-500" />
                                    </button>

                                    {/* DELETE */}
                                    <button
                                        onClick={() => {
                                            setDeleteId(c.id);
                                            setConfirmOpen(true);
                                        }}
                                        className="p-2 rounded-md hover:bg-muted transition"
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
                open={openModal}
                title={editItem ? "Edit Category" : "Add Category"}
                onClose={() => {
                    if (!saving) setOpenModal(false);
                }}
            >
                <Input
                    placeholder="Category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (!saving) setOpenModal(false);
                        }}
                        disabled={saving}
                    >
                        Cancel
                    </Button>

                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </span>
                        ) : editItem ? (
                            "Update"
                        ) : (
                            "Create"
                        )}
                    </Button>
                </div>
            </AppModal>

            <ConfirmModal
                open={confirmOpen}
                title="Delete Category?"
                description="This action cannot be undone."
                loading={deleting}
                onCancel={() => {
                    if (!deleting) {
                        setConfirmOpen(false);
                    }
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
}