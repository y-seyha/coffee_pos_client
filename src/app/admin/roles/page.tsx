"use client";

import { useEffect, useMemo, useState } from "react";
import { roleApi } from "@/lib/api/role.api";
import { Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    ShieldCheck,
    Users,
    RefreshCcw,
    Plus,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { AppTable } from "@/components/dashboard/AppTable";
import { AppTableHeader } from "@/components/dashboard/AppTableHeader";
import { AppTableRow } from "@/components/dashboard/AppTableRow";
import { AppTableCell } from "@/components/dashboard/AppTableCell";
import {AppModal} from "@/components/dashboard/AppModal";
import {ConfirmModal} from "@/components/dashboard/ConfirmModal";


export default function RoleManagementPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchRoles = async () => {
        try {
            setLoading(true);

            const res = await roleApi.getList();

            setRoles(Array.isArray(res) ? res : []);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to load roles"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const filteredRoles = useMemo(() => {
        const keyword = search.toLowerCase();

        return roles.filter((role) => {
            return (
                role.name?.toLowerCase().includes(keyword) ||
                role.description?.toLowerCase().includes(keyword)
            );
        });
    }, [roles, search]);


    const openCreateModal = () => {
        setEditingRole(null);

        setFormData({
            name: "",
            description: "",
        });

        setOpenModal(true);
    };


    const openEditModal = (role: Role) => {
        setEditingRole(role);

        setFormData({
            name: role.name || "",
            description: role.description || "",
        });

        setOpenModal(true);
    };

    const handleSubmit = async () => {
        try {
            if (!formData.name.trim()) {
                toast.error("Role name is required");
                return;
            }

            setFormLoading(true);
            const payload = {
                name: formData.name.toUpperCase(),
                description: formData.description,
            };

            if (editingRole) {
                await roleApi.update(editingRole.id, payload);
                toast.success("Role updated successfully");
            } else {
                await roleApi.create(payload);
                toast.success("Role created successfully");
            }
            setOpenModal(false);
            fetchRoles();
        } catch (error: any) {
            toast.error(
                // error?.response?.data?.message ||
                "Operation failed"
            );
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedRole) return;
        try {
            setDeleteLoading(true);
            await roleApi.remove(selectedRole.id);
            toast.success("Role deleted successfully");
            setDeleteOpen(false);
            fetchRoles();

        } catch (error: any) {
            toast.error(
                // error?.response?.data?.message ||
                "Failed to delete role"
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Role Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage system roles and permissions
                    </p>
                </div>

                <div className="flex items-center gap-2">

                    <Button
                        variant="outline"
                        onClick={fetchRoles}
                        disabled={loading}
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>

                    <Button onClick={openCreateModal}>
                        <Plus className="w-4 h-4 mr-2" />

                        Add Role
                    </Button>
                </div>
            </div>

            {/* FILTER */}
            <div className="bg-white border rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <Input
                    placeholder="Search role name or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />

                <div className="text-sm text-muted-foreground">
                    Total Roles: {filteredRoles.length}
                </div>
            </div>

            {/* TABLE */}
            <AppTable>
                <AppTableHeader cols={7}>
                    <div>No.</div>
                    <div>Role</div>
                    <div>Description</div>
                    <div>Users</div>
                    <div>Created</div>
                    <div>Status</div>
                    <div>Actions</div>
                </AppTableHeader>

                {loading ? (

                    <div className="p-10 flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : filteredRoles.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground">
                        No roles found
                    </div>
                ) : (
                    filteredRoles.map((role, i) => (
                        <AppTableRow
                            key={role.id}
                            cols={7}
                            index={role.id}
                        >
                            {/* NO */}
                            <AppTableCell>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {i + 1}
                                </span>
                            </AppTableCell>

                            {/* ROLE */}
                            <AppTableCell>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            {role.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Role ID: #{role.id}
                                        </p>
                                    </div>
                                </div>
                            </AppTableCell>

                            {/* DESCRIPTION */}
                            <AppTableCell>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {role.description || "-"}
                                </p>
                            </AppTableCell>

                            {/* USERS */}
                            <AppTableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {role.users?.length || 0} users
                                        </span>
                                    </div>
                                    {!!role.users?.length && (
                                        <div className="text-xs text-muted-foreground">
                                            {role.users
                                                .slice(0, 2)
                                                .map((u) => u.name)
                                                .join(", ")}

                                            {role.users.length > 2 &&
                                                ` +${role.users.length - 2} more`}
                                        </div>
                                    )}
                                </div>
                            </AppTableCell>

                            {/* CREATED */}
                            <AppTableCell>
                                <span className="text-xs text-muted-foreground">
                                    {role.created_at
                                        ? new Date(
                                            role.created_at
                                        ).toLocaleDateString()
                                        : "-"}
                                </span>
                            </AppTableCell>

                            {/* STATUS */}
                            <AppTableCell>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    Active
                                </span>
                            </AppTableCell>

                            {/* ACTIONS */}
                            <AppTableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        {/* EDIT */}
                                        <DropdownMenuItem
                                            onClick={() => openEditModal(role)}
                                        >
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit Role
                                        </DropdownMenuItem>
                                        {/* DELETE */}
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setDeleteOpen(true);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Role
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </AppTableCell>
                        </AppTableRow>
                    ))
                )}
            </AppTable>

            {/* CREATE / EDIT MODAL */}
            <AppModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={
                    editingRole
                        ? "Edit Role"
                        : "Create Role"
                }
            >
                <div className="space-y-4">
                    {/* NAME */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Role Name
                        </label>
                        <Input
                            placeholder="ADMIN"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value.toUpperCase(),
                                }))
                            }
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Description
                        </label>
                        <Textarea
                            placeholder="Role description..."
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpenModal(false)}
                            disabled={formLoading}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={formLoading}
                        >
                            {formLoading && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {editingRole
                                ? "Update Role"
                                : "Create Role"}
                        </Button>
                    </div>
                </div>
            </AppModal>

            {/* DELETE MODAL */}
            <ConfirmModal
                open={deleteOpen}
                onCancel={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                loading={deleteLoading}
                title="Delete Role"
                description={`Are you sure you want to delete "${selectedRole?.name}"?`}
            />
        </div>
    );
}