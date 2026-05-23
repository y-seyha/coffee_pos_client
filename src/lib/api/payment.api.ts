import { apiRequest } from "@/helper/api.helper";
import {
    Payment,
    PaymentDashboard,
    PaginatedResponse,
} from "@/types";

export const paymentApi = {
    getPaymentDashboard: () =>
        apiRequest<PaymentDashboard>("get", "/payments/dashboard"),

    getAll: (params?: any) =>
        apiRequest<PaginatedResponse<Payment[]>>(
            "get",
            "/payments",
            undefined,
            { params }
        ),

    getById: (id: number) =>
        apiRequest<Payment>("get", `/payments/${id}`),

    markPaid: (
        id: number,
        data: {
            transaction_id?: string;
            remarks?: string;
            payment_response?: string;
        }
    ) =>
        apiRequest("patch", `/payments/${id}/paid`, data),

    markFailed: (id: number, remarks?: string) =>
        apiRequest("patch", `/payments/${id}/failed`, {
            remarks,
        }),

    refund: (id: number, reason?: string) =>
        apiRequest("patch", `/payments/${id}/refund`, {
            reason,
        }),
};