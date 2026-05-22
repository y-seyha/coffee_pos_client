import {apiRequest} from "@/helper/api.helper";


export type Category = {
    id: number;
    name: string;
    products?: any[];
};

export type CreateCategoryDto = {
    name: string;
};

export type UpdateCategoryDto = {
    name?: string;
};

export const categoryApi = {
    getAll: () =>
        apiRequest<Category[]>("get", "/categories"),

    getOne: (id: number) =>
        apiRequest<Category>("get", `/categories/${id}`),

    create: (data: CreateCategoryDto) =>
        apiRequest<Category, CreateCategoryDto>("post", "/categories", data),

    update: (id: number, data: UpdateCategoryDto) =>
        apiRequest<Category, UpdateCategoryDto>("patch", `/categories/${id}`, data),

    remove: (id: number) =>
        apiRequest<{ success: boolean }>("delete", `/categories/${id}`),
};