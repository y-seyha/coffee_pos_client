import { apiRequest } from "@/helper/api.helper";
import { Role, RoleListResponse } from "@/types";

export const roleApi = {
    getList: (params?: any) =>
        apiRequest<RoleListResponse>("get", "/roles", undefined, { params }
        ),

    getById: (id: number) =>
        apiRequest<Role>("get", `/roles/${id}`
        ),

    create: (data: {
        name: string;
        description?: string;
    }) =>
        apiRequest("post", "/roles", data
        ),

    update: (id: number, data: {
        name?: string; description?: string;
        }) =>
        apiRequest("patch", `/roles/${id}`, data
        ),

    remove: (id: number) =>
        apiRequest("delete", `/roles/${id}`),
};