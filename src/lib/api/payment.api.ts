import { apiRequest } from "@/helper/api.helper";
import {AnalyticsReport, PaymentDashboard} from "@/types";

export const paymentApi = {
    getPaymentDashboard: () =>
        apiRequest<PaymentDashboard>("get", "/payments/dashboard"),

    getAll: (params?: any) =>
        apiRequest("get", "/payments", undefined, { params }),

    getById: (id: number) =>
        apiRequest("get", `/payments/${id}`),

    markPaid: (id: number, transaction_id: string) =>
        apiRequest("patch", `/payments/${id}/paid`, {
            transaction_id,
        }),

    markFailed: (id: number, remarks: string) =>
        apiRequest("patch", `/payments/${id}/failed`, {
            remarks,
        }),

    refund: (id: number, reason: string) =>
        apiRequest("patch", `/payments/${id}/refund`, {
            reason,
        }),

    getReport: () =>
        apiRequest<AnalyticsReport>("get", "/orders/report"),
};