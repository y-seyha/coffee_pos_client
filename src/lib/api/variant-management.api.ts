import {
    VariantGroup,
    VariantOption,
    CreateVariantGroupDto,
    UpdateVariantGroupDto,
    CreateVariantOptionDto,
    UpdateVariantOptionDto,
} from "@/types";
import {apiRequest} from "@/helper/api.helper";

export const variantGroupApi = {
    getAll: () =>
        apiRequest<{ data: VariantGroup[] }>("get", "/admin/variant-groups"),

    getOne: (id: number) =>
        apiRequest<{ data: VariantGroup }>(
            "get",
            `/admin/variant-groups/${id}`
        ),

    create: (dto: CreateVariantGroupDto) =>
        apiRequest("post", "/admin/variant-groups", dto),

    update: (id: number, dto: UpdateVariantGroupDto) =>
        apiRequest("patch", `/admin/variant-groups/${id}`, dto),

    remove: (id: number) =>
        apiRequest("delete", `/admin/variant-groups/${id}`),
};

export const variantOptionApi = {
    getAll: () =>
        apiRequest<{ data: VariantOption[] }>(
            "get",
            "/admin/variant-options"
        ),

    create: (dto: CreateVariantOptionDto) =>
        apiRequest("post", "/admin/variant-options", dto),

    update: (id: number, dto: UpdateVariantOptionDto) =>
        apiRequest("patch", `/admin/variant-options/${id}`, dto),

    remove: (id: number) =>
        apiRequest("delete", `/admin/variant-options/${id}`),
};