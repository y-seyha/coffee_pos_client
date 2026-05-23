import {CreateDiscountDto, Discount} from "@/types";
import {apiRequest} from "@/helper/api.helper";

export const discountApi = {
    getAll: () =>
        apiRequest<Discount[]>(
            "get",
            "/discounts"
        ),

    getById: (id: number) =>
        apiRequest<Discount>(
            "get",
            `/discounts/${id}`
        ),

    create: (dto: CreateDiscountDto) =>
        apiRequest<Discount>(
            "post",
            "/discounts",
            dto
        ),

    update: (
        id: number,
        dto: Partial<CreateDiscountDto>
    ) =>
        apiRequest<Discount>(
            "patch",
            `/discounts/${id}`,
            dto
        ),

    delete: (id: number) =>
        apiRequest(
            "delete",
            `/discounts/${id}`
        ),

    toggle: (id: number) =>
        apiRequest<Discount>(
            "patch",
            `/discounts/${id}/toggle`
        ),
};