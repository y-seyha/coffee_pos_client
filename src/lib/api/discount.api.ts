import {Discount} from "@/types";
import {apiRequest} from "@/helper/api.helper";

export const discountApi = {
    getAll: () =>
        apiRequest<Discount[]>(
            "get",
            "/discounts"
        ),
};