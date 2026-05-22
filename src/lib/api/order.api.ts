import { apiRequest } from "@/helper/api.helper";
import {Order, OrderReport, OrderStatusStats, PaginatedResponse, TopProductDto} from "@/types";

export const orderApi = {
    getAll: (params?: any) =>
        apiRequest<PaginatedResponse<Order[]>>(
            "get",
            "/orders",
            undefined,
            { params }
        ),
    getById: (id: number) =>
        apiRequest<Order>("get", `/orders/${id}`),

    getReport: (params?: any) =>
        apiRequest<OrderReport>("get", "/orders/report", undefined, { params }),

    getStatusStats: () =>
        apiRequest<OrderStatusStats>("get", "/orders/stats/status"),

    getDailySales: (date: string) =>
        apiRequest<number>("get", "/orders/stats/daily-sales", undefined, {
            params: { date },
        }),

    getMonthlyRevenue: (month: number, year: number) =>
        apiRequest<number>("get", "/orders/stats/monthly-revenue", undefined, {
            params: { month, year },
        }),

    getTopProducts: (limit = 10) =>
        apiRequest<TopProductDto[]>("get", "/orders/stats/top-products", undefined, {
            params: { limit },
        }),

    confirm: (id: number, dto: any) =>
        apiRequest<Order>("patch", `/orders/${id}/confirm`, dto),

    cancel: (id: number, dto: any) =>
        apiRequest<Order>("patch", `/orders/${id}/cancel`, dto),

    complete: (id: number, dto: any) =>
        apiRequest<Order>("patch", `/orders/${id}/complete`, dto),
};