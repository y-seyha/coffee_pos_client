"use client";

import { useEffect, useMemo, useState } from "react";
import { productApi } from "@/lib/api/product.api";
import {Discount, Product, ProductCategory, VariantGroup,} from "@/types";
import { AppTable } from "@/components/dashboard/AppTable";
import { AppTableHeader } from "@/components/dashboard/AppTableHeader";
import { AppTableRow } from "@/components/dashboard/AppTableRow";
import { AppTableCell } from "@/components/dashboard/AppTableCell";
import { AppModal } from "@/components/dashboard/AppModal";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Pencil,
    Trash2,
    Package,
    Flame,
    Plus, MoreHorizontal, TicketPercent, XCircle, Boxes, ToggleRight, ToggleLeft,
} from "lucide-react";

import { toast } from "sonner";
import {categoryApi} from "@/lib/api/category.api";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {variantGroupApi} from "@/lib/api/variant-management.api";
import {discountApi} from "@/lib/api/discount.api";
import {SalesPieChart} from "@/components/dashboard/product/SalesPieChart";

type ProductMeta = {
    total: number;
    page: number;
    lastPage: number;
    active?: number;
    inactive?: number;
};

export default function ProductDashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [_loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [_openActionId, setOpenActionId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"id" | "name" | "price" | "created_at">("id");
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editItem, setEditItem] = useState<Product | null>(null);
    const [files, setFiles] = useState<FileList | null>(null);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [discountModalOpen, setDiscountModalOpen] = useState(false);
    const [variantModalOpen, setVariantModalOpen] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [confirmDiscountOpen, setConfirmDiscountOpen] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [meta, setMeta] = useState<ProductMeta>({
        total: 0,
        page: 1,
        lastPage: 1,
        active: 0,
        inactive: 0,
    });

    const [form, setForm] = useState({
        name: "",
        sku: "",
        price: "",
        category_id: 1,
        description: "",
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await productApi.getAll({
                page,
                limit: 10,
                search,
                sortBy,
                sortOrder,
                categoryId,
            });
            setProducts(res.data);
            setMeta(res.meta);
        } catch (err) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchBestSellers = async () => {
        try {
            const res = await productApi.getBestSellers(5);

            setBestSellers(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    const totalProducts = meta.total;
    const activeProducts = meta.active;
    const inactiveProducts = meta.inactive;

    // const activeProducts = useMemo(() => {
    //     return products.filter((p) => p.is_available).length;
    // }, [products]);
    //
    // const inactiveProducts = useMemo(() => {
    //     return products.filter((p) => !p.is_available).length;
    // }, [products]);

    const openCreate = () => {
        setEditItem(null);

        setForm({
            name: "",
            sku: "",
            price: "",
            category_id: 0,
            description: "",
        });

        setOpen(true);
    };

    const openEdit = (p: Product) => {

        setEditItem(p);

        setForm({
            name: p.name,
            sku: p.sku,
            price: String(p.price),
            category_id: p.category_id,
            description: p.description ?? "",
        });

        setOpen(true);
    };

    const salesData = useMemo(() => {
        const map = new Map<string, number>();

        bestSellers.forEach((p) => {
            const name = p.name;
            const sold = (p as any).sold || 0;

            map.set(name, (map.get(name) || 0) + sold);
        });

        return Array.from(map.entries()).map(([name, value]) => ({
            name,
            value,
        }));
    }, [bestSellers]);

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("sku", form.sku);
            formData.append("price", String(Number(form.price)));
            formData.append("category_id", String(form.category_id));
            formData.append("description", form.description);

            if (files) {
                Array.from(files).forEach((file) => {
                    formData.append("files", file);
                });
            }
            if (editItem) {
                await productApi.update(
                    editItem.id,
                    formData
                );
                toast.success("product updated");
            } else {
                await productApi.create(formData);
                toast.success("product created");
            }

            setOpen(false);
            setFiles(null);
            fetchProducts();
        } catch (err: any) {
            toast.error("Save failed", {
                description:
                // err?.response?.data?.message,
                "Cannot Save products"
            });
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await productApi.delete(deleteId);
            toast.success("product deleted");
            fetchProducts();
        } catch (err) {
            toast.error("Delete failed");
        } finally {
            setDeleteId(null);
            setConfirmOpen(false);
        }
    };

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [discountRes, variantRes] = await Promise.all([
                    discountApi.getAll(),
                    variantGroupApi.getAll(),
                ]);

                setDiscounts(discountRes);
                setVariantGroups(variantRes.data);

            } catch (err) {
                console.log(err);
                toast.error("Failed to load metadata");
            }
        };

        fetchMeta();
    }, []);

    useEffect(() => {
        const handleClickOutside = () => setOpenActionId(null);

        window.addEventListener("click", handleClickOutside);

        return () =>
            window.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryApi.getAll(); // assume exists
                setCategories(res);
            } catch (err) {
                console.log(err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [page, search, sortBy, sortOrder, categoryId]);

    useEffect(() => {
        fetchBestSellers();
    }, []);

    return (
        <div className="p-6 space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="w-6 h-6" />
                        Products Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage products, discounts, variants and analytics
                    </p>
                </div>

                <Button onClick={openCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/*Filter*/}
            <div className="bg-white border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-5 gap-4">

                <Input
                    placeholder="Search by name or SKU"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border rounded-lg px-3"
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(
                            e.target.value as
                                "id"
                                | "name"
                                | "price"
                                | "created_at"
                        )
                    }
                >
                    <option value="id">Default</option>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="created_at">Newest</option>
                </select>

                <select
                    className="border rounded-lg px-3"
                    value={sortOrder}
                    onChange={(e) =>
                        setSortOrder(e.target.value as "ASC" | "DESC")
                    }
                >
                    <option value="DESC">DESC</option>
                    <option value="ASC">ASC</option>
                </select>

                <select
                    className="border rounded-lg px-3"
                    value={categoryId ?? ""}
                    onChange={(e) => setCategoryId(Number(e.target.value) || undefined)}
                >
                    <option value="">All Categories</option>

                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <Button onClick={fetchProducts}>
                    Apply Filters
                </Button>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-muted-foreground">
                        Total Products
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {totalProducts}
                    </h2>
                </div>

                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-muted-foreground">
                        Active
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-green-600">
                        {activeProducts}
                    </h2>
                </div>

                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-muted-foreground">
                        Inactive
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-red-600">
                        {inactiveProducts}
                    </h2>
                </div>
            </div>

            {/* BEST SELLERS */}
            <div className="bg-white border rounded-2xl p-5 space-y-4">

                {/* HEADER */}
                <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h2 className="font-semibold">Best Sellers</h2>
                </div>

                {/* BODY GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* LEFT: LIST */}
                    <div className="space-y-3">
                        {bestSellers.map((p, i) => (
                            <div
                                key={p.id}
                                className="flex justify-between border rounded-xl px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        #{i + 1} {p.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {p.category?.name}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold">
                                        Sold: {(p as any).sold}
                                    </p>
                                    <p className="text-sm text-green-600">
                                        ${p.final_price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: CHART */}
                    <div className="h-[320px] flex items-center justify-center">
                        <SalesPieChart data={salesData} />
                    </div>

                </div>
            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-[800px]">
                    <AppTable>
                        {/* HEADER */}
                        <AppTableHeader cols={12}>
                            <div>No.</div>
                            <div>ID</div>
                            <div>Image</div>
                            <div>Name</div>
                            <div>SKU</div>
                            <div>Category</div>
                            <div>Price</div>
                            <div>Final</div>
                            <div>Discount</div>
                            <div>Available</div>
                            <div>Variants</div>
                            <div>Actions</div>
                        </AppTableHeader>

                        {/* ROWS */}
                        {products.map((p, i) => (
                            <AppTableRow key={p.id} index={i} cols={12}>

                                {/* No. */}
                                <AppTableCell>
                                    <span className="text-muted-foreground">{i + 1}</span>
                                </AppTableCell>

                                {/* ID */}
                                <AppTableCell>
                                    <span className=" text-muted-foreground">#{p.id}</span>
                                </AppTableCell>

                                {/* IMAGE */}
                                <AppTableCell>
                                    {p.images?.[0]?.url ? (
                                        <img
                                            src={p.images[0].url}
                                            alt={p.name}
                                            className="w-14 h-14 object-cover rounded-lg border"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 bg-gray-100 rounded-lg" />
                                    )}
                                </AppTableCell>

                                {/* NAME */}
                                <AppTableCell>
                                    <div className="max-w-[200px]">
                                        <p className="font-medium truncate">
                                            {p.name}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {new Date(p.created_at!).toLocaleDateString()}
                                        </p>
                                    </div>
                                </AppTableCell>

                                {/* SKU */}
                                <AppTableCell>
                                    <div className="max-w-[140px] truncate">
                                        {p.sku}
                                    </div>
                                </AppTableCell>

                                {/* CATEGORY */}
                                <AppTableCell>
                                    {p.category?.name}
                                </AppTableCell>

                                {/* PRICE */}
                                <AppTableCell>
                                    ${Number(p.price).toFixed(2)}
                                </AppTableCell>

                                {/* FINAL PRICE */}
                                <AppTableCell>
                <span className="font-semibold text-green-600">
                    ${Number(p.final_price ?? 0).toFixed(2)}
                </span>
                                </AppTableCell>

                                {/* DISCOUNT */}
                                <AppTableCell>
                                    {p.discount ? (
                                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                        {p.discount.type === "PERCENTAGE"
                            ? `${p.discount.value}%`
                            : `$${p.discount.value}`}
                    </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">
                        No discount
                    </span>
                                    )}
                                </AppTableCell>

                                {/* AVAILABLE */}
                                <AppTableCell>
                <span
                    className={
                        p.is_available
                            ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                            : "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs"
                    }
                >
                    {p.is_available ? "Yes" : "No"}
                </span>
                                </AppTableCell>

                                {/* VARIANTS */}
                                <AppTableCell>
                <span className="text-sm text-muted-foreground">
                    {p.variant_groups?.length ?? 0}
                </span>
                                </AppTableCell>

                                {/* ACTIONS */}
                                <AppTableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-52">

                                            {/* EDIT */}
                                            <DropdownMenuItem onClick={() => openEdit(p)}>
                                                <Pencil className="w-4 h-4 mr-2 text-blue-500" />
                                                Edit Product
                                            </DropdownMenuItem>

                                            {/* DELETE */}
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setDeleteId(p.id);
                                                    setConfirmOpen(true);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                                                Delete Product
                                            </DropdownMenuItem>

                                            {/* DIVIDER */}
                                            <div className="h-px bg-gray-100 my-1" />

                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    try {
                                                        await productApi.toggleAvailability(
                                                            p.id,
                                                            !p.is_available
                                                        );

                                                        toast.success(
                                                            p.is_available
                                                                ? "Product marked unavailable"
                                                                : "Product marked available"
                                                        );

                                                        fetchProducts();
                                                    } catch (err) {
                                                        toast.error("Failed to update availability");
                                                    }
                                                }}
                                            >
                                                {p.is_available ? (
                                                    <ToggleRight className="w-4 h-4 mr-2 text-green-600" />
                                                ) : (
                                                    <ToggleLeft className="w-4 h-4 mr-2 text-gray-500" />
                                                )}

                                                {p.is_available ? "Mark Unavailable" : "Mark Available"}
                                            </DropdownMenuItem>

                                            {/* ASSIGN DISCOUNT */}
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelectedProduct(p);
                                                    setDiscountModalOpen(true);
                                                }}
                                            >
                                                <TicketPercent className="w-4 h-4 mr-2 text-green-600" />
                                                Assign Discount
                                            </DropdownMenuItem>

                                            {/* REMOVE DISCOUNT */}
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    await productApi.removeDiscount(p.id);
                                                    toast.success("Discount removed");
                                                    fetchProducts();
                                                }}
                                            >
                                                <XCircle className="w-4 h-4 mr-2 text-orange-500" />
                                                Remove Discount
                                            </DropdownMenuItem>

                                            {/* ATTACH VARIANTS */}
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelectedProduct(p);
                                                    setVariantModalOpen(true);
                                                }}
                                            >
                                                <Boxes className="w-4 h-4 mr-2 text-purple-500" />
                                                Attach Variant Group
                                            </DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </AppTableCell>

                            </AppTableRow>
                        ))}
                    </AppTable>

                </div>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                    Page {meta.page} of {meta.lastPage}
                </p>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={meta.page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        disabled={meta.page >= meta.lastPage}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* MODAL */}

            <AppModal
                open={open}
                title={editItem ? "Edit product" : "Create product"}
                onClose={() => setOpen(false)}
            >
                <div className="space-y-4">
                    {/* Name */}
                    <Input
                        placeholder="Product name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                    {/* SKU */}
                    <Input
                        placeholder="SKU"
                        value={form.sku}
                        onChange={(e) =>
                            setForm({ ...form, sku: e.target.value })
                        }
                    />
                    <Input
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                        }
                    />
                    {/* Category (NEW) */}
                    <select
                        className="w-full border rounded-lg p-2"
                        value={form.category_id}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                category_id: Number(e.target.value),
                            })
                        }
                    >
                        <option value={0}>Select category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* Description */}
                    <textarea
                        className="w-full border rounded-lg p-3 min-h-[120px]"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                    />

                    {/* Images */}
                    <div>
                        <label className="text-sm font-medium">
                            Product Images
                        </label>

                        <Input
                            type="file"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                        />
                    </div>

                    {/* Submit */}
                    <Button className="w-full" onClick={handleSave}>
                        {editItem ? "Update product" : "Create product"}
                    </Button>
                </div>
            </AppModal>

            {/* DELETE */}

            <ConfirmModal
                open={confirmOpen}
                title="Delete Product?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />

            <AppModal
                open={discountModalOpen}
                title="Assign Discount"
                onClose={() => setDiscountModalOpen(false)}
            >
                <div className="space-y-3">
                    {discounts.map((d) => {
                        const isActive = d.is_active;

                        return (
                            <button
                                key={d.id}
                                disabled={!isActive}
                                className={`
                        w-full border rounded-xl p-4 text-left transition
                        ${
                                    isActive
                                        ? "hover:bg-gray-50 border-gray-200"
                                        : "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                                }
                    `}
                                onClick={() => {
                                    if (!isActive) return;

                                    setSelectedDiscount(d);
                                    setConfirmDiscountOpen(true);
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-sm">
                                            {d.name}
                                        </p>

                                        <p className="text-xs text-muted-foreground mt-1">
                                            {d.type} - {d.value}
                                        </p>
                                    </div>

                                    <span
                                        className={`
                                text-[11px] px-2 py-1 rounded-full font-medium
                                ${
                                            isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }
                            `}
                                    >
                            {isActive ? "Active" : "Inactive"}
                        </span>
                                </div>

                                {(d.start_date || d.end_date) && (
                                    <div className="mt-2 text-[11px] text-muted-foreground">
                                        {d.start_date && (
                                            <p>
                                                Start:{" "}
                                                {new Date(d.start_date).toLocaleDateString()}
                                            </p>
                                        )}

                                        {d.end_date && (
                                            <p>
                                                End:{" "}
                                                {new Date(d.end_date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </AppModal>

            <AppModal
                open={variantModalOpen}
                title="Attach Variant Group"
                onClose={() => {
                    setVariantModalOpen(false);
                    setSelectedVariantId(null);
                }}
            >
                <div className="space-y-4">

                    <select
                        className="w-full border rounded-xl p-3"
                        value={selectedVariantId ?? ""}
                        onChange={(e) =>
                            setSelectedVariantId(Number(e.target.value))
                        }
                    >
                        <option value="">
                            Select Variant Group
                        </option>

                        {variantGroups.map((vg) => (
                            <option key={vg.id} value={vg.id}>
                                {vg.name}
                            </option>
                        ))}
                    </select>

                    <Button
                        className="w-full"
                        disabled={!selectedVariantId}
                        onClick={async () => {
                            if (!selectedProduct || !selectedVariantId) return;

                            try {
                                await productApi.attachVariantGroup(
                                    selectedProduct.id,
                                    {
                                        variant_group_id: selectedVariantId,
                                    }
                                );
                                toast.success("Variant group attached");
                                fetchProducts();
                                setVariantModalOpen(false);
                                setSelectedVariantId(null);

                            } catch (err) {
                                toast.error("Failed to attach variant group or variant group already attached");
                            }
                        }}
                    >
                        Save Variant Group
                    </Button>
                </div>
            </AppModal>

            <ConfirmModal
                open={confirmDiscountOpen}
                title="Assign this discount?"
                onCancel={() => {
                    setConfirmDiscountOpen(false);
                    setSelectedDiscount(null);
                }}
                onConfirm={async () => {
                    if (!selectedProduct || !selectedDiscount) return;

                    try {
                        await productApi.assignDiscount(
                            selectedProduct.id,
                            selectedDiscount.id
                        );
                        toast.success("Discount assigned");
                        fetchProducts();
                        setConfirmDiscountOpen(false);
                        setDiscountModalOpen(false);
                        setSelectedDiscount(null);
                    } catch (err) {
                        toast.error("Failed to assign discount");
                    }
                }}
            />

        </div>
    );
}