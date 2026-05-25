"use client";

import { useEffect, useState } from "react";
import { usersApi } from "@/lib/api/users.api";
import { roleApi } from "@/lib/api/role.api"
import { User, Role } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    RefreshCcw,
    ShieldCheck,
    User as UserIcon,
    Plus,
    Power,
    Pencil,
    Trash2, KeyRound, EyeOff, Eye,
} from "lucide-react";
import { AppTable } from "@/components/dashboard/AppTable";
import { AppTableHeader } from "@/components/dashboard/AppTableHeader";
import { AppTableRow } from "@/components/dashboard/AppTableRow";
import { AppTableCell } from "@/components/dashboard/AppTableCell";
import {AppModal} from "@/components/dashboard/AppModal";
import {ConfirmModal} from "@/components/dashboard/ConfirmModal";


export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [order, setOrder] = useState("DESC");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        total: 0,
        page: 1,
        totalPages: 1,
    });
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role_id: 0,
        position: "",
        hire_date: "",
        salary: "",
        address: "",
    });
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newRoleId, setNewRoleId] = useState<number>(0);
    const [passwordForm, setPasswordForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [confirmType, setConfirmType] = useState<"delete" | "role" | "password" | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailUser, setDetailUser] = useState<User | null>(null);
    const POSITION_OPTIONS = ["Cashier", "Barista", "Manager"] as const;
    type Position = (typeof POSITION_OPTIONS)[number];
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordsMatch =
        passwordForm.password &&
        passwordForm.confirmPassword &&
        passwordForm.password === passwordForm.confirmPassword;

    const TableSkeleton = () => (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="grid grid-cols-9 gap-3 p-3 border-b animate-pulse"
                >
                    {Array.from({ length: 9 }).map((__, j) => (
                        <div
                            key={j}
                            className="h-4 bg-gray-200 rounded w-full"
                        />
                    ))}
                </div>
            ))}
        </>
    );

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const res: any = await usersApi.getList({
                search: search || undefined,
                role: role || undefined,
                is_active: status || undefined,
                sortBy,
                order,
                page,
                limit: 10,
            });

            setUsers(res.data || []);
            setMeta(res.meta);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res: any = await roleApi.getList();
            setRoles(Array.isArray(res) ? res : res?.data || []);
        } catch {}
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search, role, status, sortBy, order]);


    useEffect(() => {
        fetchRoles();
    }, []);
    useEffect(() => {
        setPage(1);
    }, [search, role, status, sortBy, order]);


    const openCreate = () => {
        setEditingUser(null);
        setForm({
            name: "",
            email: "",
            password: "",
            phone: "",
            role_id: 0,
            position: "",
            hire_date: "",
            salary: "",
            address: "",
        });
        setOpen(true);
    };

    const openEdit = (user: User) => {
        setEditingUser(user);

        setForm({
            name: user.name || "",
            email: user.email || "",
            password: "",
            phone: user.phone || "",
            role_id: user.role?.id || 0,

            position: user.staffProfile?.position || "",
            hire_date: user.staffProfile?.hire_date?.slice(0, 10) || "",
            salary: user.staffProfile?.salary || "",
            address: user.staffProfile?.address || "",
        });

        setOpen(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            if (!form.name || !form.email || !form.role_id) {
                toast.error("Please fill required fields");
                setSaving(false);
                return;
            }

            if (!editingUser && !form.password.trim()) {
                toast.error("Password is required");
                setSaving(false);
                return;
            }

            if (editingUser) {
                if (editingUser) {
                    const payload = {
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                        position: form.position,
                        hire_date: form.hire_date,
                        salary: form.salary,
                        address: form.address,
                    };

                    await usersApi.update(editingUser.id, payload);
                    toast.success("User updated successfully");
                }
            } else {
                await usersApi.create(form);
                toast.success("User created successfully");
            }

            setOpen(false);
            fetchUsers();

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };

    const handleConfirm = async () => {
        if (!deleteId || !confirmType) return;

        try {
            setDeleteLoading(true);

            switch (confirmType) {
                case "delete":
                    await usersApi.remove(deleteId);
                    toast.success("User deleted");
                    break;

                case "role":
                    await usersApi.changeRole(deleteId, newRoleId);
                    toast.success("Role updated");
                    break;

                case "password":
                    await usersApi.resetPassword(deleteId, {
                        new_password: passwordForm.password,
                    });
                    toast.success("Password reset");
                    break;
            }

            await fetchUsers();

            setConfirmOpen(false);
            setConfirmType(null);
            setDeleteId(null);

        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Action failed");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage users, staff accounts, and permissions
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchUsers}>
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>

                    <Button onClick={openCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>

            </div>

            {/* FILTER */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white border rounded-2xl p-4">

                <Input
                    placeholder="Search users by name, email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border rounded-lg px-3"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">All Roles</option>
                    {roles.map((r) => (
                        <option key={r.id} value={r.name}>
                            {r.name}
                        </option>
                    ))}
                </select>

                <select
                    className="border rounded-lg px-3"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <select
                    className="border rounded-lg px-3"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="created_at">Created Date</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="role">Role</option>
                </select>

                <select
                    className="border rounded-lg px-3"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                >
                    <option value="DESC">DESC</option>
                    <option value="ASC">ASC</option>
                </select>

            </div>

            {/* TABLE */}
            <AppTable>

                <AppTableHeader cols={9}>
                    <div>No.</div>
                    <div>ID</div>
                    <div>User</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div>Employee</div>
                    <div>Status</div>
                    <div>Last Login</div>
                    <div>Actions</div>
                </AppTableHeader>

                {loading ? (
                    <TableSkeleton />
                ) : users.length === 0 ? (
                    <div className="p-10 text-center">No users found</div>
                ) : (
                    users.map((user, i) => (
                        <AppTableRow key={user.id} cols={9} index={user.id}>

                            {/* No */}
                            <AppTableCell>
                                {(page - 1) * 10 + i + 1}
                            </AppTableCell>

                            {/* ID */}
                            <AppTableCell>
        <span className="text-xs text-muted-foreground">
            #{user.id}
        </span>
                            </AppTableCell>

                            {/* USER */}
                            <AppTableCell>
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-4 h-4 text-primary" />
                                    <span className="font-medium">{user.name}</span>
                                </div>
                            </AppTableCell>

                            {/* EMAIL */}
                            <AppTableCell>{user.email}</AppTableCell>

                            {/* ROLE */}
                            <AppTableCell>
        <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
            {user.role?.name || "-"}
        </span>
                            </AppTableCell>

                            {/* EMPLOYEE */}
                            <AppTableCell>
                                {user.staffProfile?.employee_code || "-"}
                            </AppTableCell>

                            {/* STATUS */}
                            <AppTableCell>
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
            }`}
        >
            {user.is_active ? "Active" : "Inactive"}
        </span>
                            </AppTableCell>

                            {/* LAST LOGIN */}
                            <AppTableCell>
                                {user.last_login_at
                                    ? new Date(user.last_login_at).toLocaleString()
                                    : "Never"}
                            </AppTableCell>

                            {/* ACTIONS */}
                            <AppTableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="outline">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">

                                        <DropdownMenuItem
                                            onClick={() => {
                                                setDetailUser(user);
                                                setDetailModalOpen(true);
                                            }}
                                        >
                                            <UserIcon className="w-4 h-4 mr-2" />
                                            View Details
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => openEdit(user)}>
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={async () => {
                                                try {
                                                    await usersApi.toggleStatus(user.id);
                                                    toast.success("Status updated");
                                                    fetchUsers();
                                                } catch {
                                                    toast.error("Failed to update");
                                                }
                                            }}
                                        >
                                            <Power className="w-4 h-4 mr-2" />
                                            {user.is_active ? "Deactivate" : "Activate"}
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setRoleModalOpen(true);
                                            }}
                                        >
                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                            Change Role
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setPasswordModalOpen(true);
                                            }}
                                        >
                                            <KeyRound className="w-4 h-4 mr-2" />
                                            Reset Password
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => {
                                                setDeleteId(user.id);
                                                setConfirmType("delete");
                                                setConfirmOpen(true);
                                            }}
                                            className="text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
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
                onClose={() => setOpen(false)}
                title={editingUser ? "Edit User" : "Add User"}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* NAME */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            placeholder="Enter full name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            placeholder="Enter email address"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                    </div>

                    {/* PASSWORD */}
                    {!editingUser && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                placeholder="Enter password"
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />
                        </div>
                    )}

                    {/* PHONE */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                            placeholder="Enter phone number"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                        />
                    </div>

                    {/* ROLE */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Role</label>

                        {editingUser ? (
                            <div className="w-full border rounded-lg p-2 bg-gray-50 text-gray-700">
                                {roles.find(r => r.id === form.role_id)?.name || "-"}
                            </div>
                        ) : (
                            <select
                                className="w-full border rounded-lg p-2"
                                value={form.role_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        role_id: Number(e.target.value),
                                    })
                                }
                            >
                                <option value={0}>Select role</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>


                    <div className="space-y-1">
                        <label className="text-sm font-medium">Position</label>

                        {editingUser ? (
                            <div className="w-full border rounded-lg p-2 bg-gray-50 text-gray-700">
                                {form.position || "-"}
                            </div>
                        ) : (
                            <select
                                className="w-full border rounded-lg p-2"
                                value={form.position}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        position: e.target.value as Position,
                                    })
                                }
                            >
                                <option value="">Select position</option>
                                {POSITION_OPTIONS.map((pos) => (
                                    <option key={pos} value={pos}>
                                        {pos}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Hire Date</label>
                        <Input
                            type="date"
                            value={form.hire_date}
                            onChange={(e) =>
                                setForm({ ...form, hire_date: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Salary</label>
                        <Input
                            type="number"
                            placeholder="300"
                            value={form.salary}
                            onChange={(e) =>
                                setForm({ ...form, salary: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Address</label>
                        <Input
                            placeholder="Phnom Penh"
                            value={form.address}
                            onChange={(e) =>
                                setForm({ ...form, address: e.target.value })
                            }
                        />
                    </div>

                    {/* BUTTON */}
                    <Button
                        className="w-full md:col-span-2"
                        disabled={saving}
                        onClick={handleSave}
                    >
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </AppModal>
            {/* PAGINATION */}
            <div className="flex items-center justify-between pt-4">

                <p className="text-sm text-muted-foreground">
                    Page {meta.page} of {meta.totalPages} • Total {meta.total}
                </p>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        disabled={page >= meta.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <AppModal
                open={roleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                title="Change User Role"
            >
                <div className="space-y-4">

                    <select
                        className="w-full border rounded-lg p-2"
                        value={newRoleId}
                        onChange={(e) => setNewRoleId(Number(e.target.value))}
                    >
                        <option value={0}>Select role</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>

                    <Button
                        className="w-full"
                        onClick={() => {
                            if (!selectedUser) return;

                            if (!newRoleId) {
                                toast.error("Please select role");
                                return;
                            }

                            setDeleteId(selectedUser.id);
                            setConfirmType("role");
                            setRoleModalOpen(false);
                            setConfirmOpen(true);
                        }}
                    >
                        Update Role
                    </Button>

                </div>
            </AppModal>

            <AppModal
                open={passwordModalOpen}
                onClose={() => {
                    setPasswordModalOpen(false);

                    setPasswordForm({
                        password: "",
                        confirmPassword: "",
                    });

                    setShowPassword(false);
                    setShowConfirmPassword(false);
                }}
                title="Reset Password"
            >
                <div className="space-y-4">

                    {/* NEW PASSWORD */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            New Password
                        </label>

                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={passwordForm.password}
                                onChange={(e) =>
                                    setPasswordForm({
                                        ...passwordForm,
                                        password: e.target.value,
                                    })
                                }
                                className="pr-10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        text-muted-foreground hover:text-foreground
                    "
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Confirm Password
                        </label>

                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) =>
                                    setPasswordForm({
                                        ...passwordForm,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                className={`
                        pr-10
                        ${
                                    passwordForm.confirmPassword
                                        ? passwordsMatch
                                            ? "border-green-500 focus-visible:ring-green-500"
                                            : "border-red-500 focus-visible:ring-red-500"
                                        : ""
                                }
                    `}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        text-muted-foreground hover:text-foreground
                    "
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* PASSWORD MATCH STATUS */}
                        {passwordForm.confirmPassword && (
                            <p
                                className={`text-xs ${
                                    passwordsMatch
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {passwordsMatch
                                    ? "Passwords match"
                                    : "Passwords do not match"}
                            </p>
                        )}
                    </div>

                    {/* BUTTON */}
                    <Button
                        className="w-full"
                        disabled={
                            !passwordForm.password ||
                            !passwordForm.confirmPassword ||
                            !passwordsMatch
                        }
                        onClick={() => {
                            if (!selectedUser) return;

                            if (!passwordsMatch) {
                                toast.error("Passwords do not match");
                                return;
                            }

                            if (passwordForm.password.length < 6) {
                                toast.error(
                                    "Password must be at least 6 characters"
                                );
                                return;
                            }

                            setConfirmOpen(true);
                            setPasswordModalOpen(false);

                            setDeleteId(selectedUser.id);
                            setConfirmType("password");
                        }}
                    >
                        Reset Password
                    </Button>

                </div>
            </AppModal>

            <AppModal
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                title="User Details"
            >
                {detailUser && (
                    <div className="space-y-6 text-sm">

                        {/* TOP USER INFO CARD */}
                        <div className="rounded-xl border p-4 space-y-4 bg-muted/30">

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <p className="text-xs text-muted-foreground">Name</p>
                                    <p className="font-semibold text-base">{detailUser.name}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="font-medium">{detailUser.email}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p>{detailUser.phone || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <span
                                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                            detailUser.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                        }`}
                                    >
                            {detailUser.is_active ? "Active" : "Inactive"}
                        </span>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Role</p>
                                    <p className="font-medium">{detailUser.role?.name || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Last Login</p>
                                    <p>
                                        {detailUser.last_login_at
                                            ? new Date(detailUser.last_login_at).toLocaleString()
                                            : "Never"}
                                    </p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-xs text-muted-foreground">Created At</p>
                                    <p>
                                        {new Date(detailUser.created_at).toLocaleString()}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* STAFF PROFILE CARD */}
                        <div className="rounded-xl border p-4 space-y-3">

                            <p className="font-semibold text-base">Staff Profile</p>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <p className="text-xs text-muted-foreground">Employee Code</p>
                                    <p className="font-medium">
                                        {detailUser.staffProfile?.employee_code || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Position</p>
                                    <p>{detailUser.staffProfile?.position || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Hire Date</p>
                                    <p>{detailUser.staffProfile?.hire_date || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Salary</p>
                                    <p>
                                        {detailUser.staffProfile?.salary
                                            ? `$${detailUser.staffProfile.salary}`
                                            : "-"}
                                    </p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-xs text-muted-foreground">Address</p>
                                    <p>{detailUser.staffProfile?.address || "-"}</p>
                                </div>

                            </div>
                        </div>

                    </div>
                )}
            </AppModal>

            {/* CONFIRM DELETE */}
            <ConfirmModal
                open={confirmOpen}
                onCancel={() => {
                    setConfirmOpen(false);
                    setConfirmType(null);
                }}
                onConfirm={handleConfirm}
                loading={deleteLoading}
                title={
                    confirmType === "delete"
                        ? "Delete User"
                        : confirmType === "role"
                            ? "Change Role"
                            : "Reset Password"
                }
                description={
                    confirmType === "delete"
                        ? "This action cannot be undone."
                        : "Are you sure you want to continue?"
                }
            />


        </div>
    );
}