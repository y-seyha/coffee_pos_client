import { apiRequest } from "@/helper/api.helper";
import {
    Product,
    ProductListResponse,
    ClientGetProductsQuery,
    CreateProductDto, GetProductsQuery,
} from "@/types";

export const productApi = {

    // ------CLIENT------
    getClientProducts: (params: ClientGetProductsQuery) =>
        apiRequest<ProductListResponse>("get", "/products/client", undefined, {
            params,
        }),

    getByCategory: (id: number) =>
        apiRequest<Product[]>(
            "get",
            `/products/categories/${id}`
        ),


    // ------ADMIN------
    getAll: (params: GetProductsQuery) =>
        apiRequest<ProductListResponse>(
            "get",
            "/products",
            undefined,
            {
                params,
            }
        ),

    getById: (id: number) =>
        apiRequest<Product>("get", `/products/${id}`),

    create: (formData: FormData) =>
        apiRequest<Product>("post", "/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },}
        ),

    update: (id: number, formData: FormData) =>
        apiRequest<Product>("patch", `/products/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },}
        ),

    delete: (id: number) =>
        apiRequest<{ message: string }>("delete", `/products/${id}`),

    getBestSellers: (limit = 10) =>

        apiRequest<ProductListResponse>("get", "/products/best-sellers", undefined, {
            params: { limit },
        }),

    assignDiscount: (productId: number, discountId: number) =>
        apiRequest("post", `/products/${productId}/discount`, {
            discountId,
        }),

    removeDiscount: (productId: number) =>
        apiRequest("delete", `/products/${productId}/discount`),

    attachVariantGroup: (
        productId: number,
        dto: {
                variant_group_id: number;
        }
    ) =>
        apiRequest("post", `/products/${productId}/variant-group`, dto),

    toggleAvailability: (productId: number, is_available?: boolean) =>
        apiRequest("patch", `/products/${productId}/availability`, {
            is_available,
        }),
};

