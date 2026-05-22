import { apiRequest } from "@/helper/api.helper";
import {
    Product,
    ProductListResponse,
    ClientGetProductsQuery,
    CreateProductDto,
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
            `/products/category/${id}`
        ),


    // ------ADMIN------
    getAll: (params: ClientGetProductsQuery) =>
        apiRequest<ProductListResponse>("get", "/products", undefined, {
            params,
        }),

    getById: (id: number) =>
        apiRequest<Product>("get", `/products/${id}`),

    create: (dto: CreateProductDto) =>
        apiRequest<Product>("post", "/products", dto),

    update: (id: number, dto: Partial<CreateProductDto>) =>
        apiRequest<Product>("patch", `/products/${id}`, dto),

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

    attachVariantGroups: (
        productId: number,
        dto: {
            variant_groups: {
                variant_group_id: number;
                is_required?: boolean;
                sort_order?: number;
            }[];
        }
    ) =>
        apiRequest("post", `/products/${productId}/variant-groups`, dto),
};

