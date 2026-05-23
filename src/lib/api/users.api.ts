import { apiRequest } from "@/helper/api.helper";
import {UserListResponse} from "@/types";

export const usersApi = {

    getList: (params?: any) =>
        apiRequest<UserListResponse>("get", "/users", undefined, { params }
        ),

    create: (data: any) =>
        apiRequest("post", "/users", data
        ),

    update: (id: number, data: any) =>
        apiRequest("patch", `/users/${id}`, data
        ),

    remove: (id: number) =>
        apiRequest("delete", `/users/${id}`
        ),

    toggleStatus: (id: number) =>
        apiRequest("patch", `/users/${id}/toggle-status`
        ),

    resetPassword: (
        id: number, data: { new_password: string; }
    ) =>
        apiRequest("patch", `/users/${id}/reset-password`, data
        ),

    changeRole: (id: number, roleId: number) =>
        apiRequest("patch", `/users/${id}/role/${roleId}`
        ),
};