import axios, {
    AxiosInstance,
    AxiosError,
} from "axios";
import {normalizeError} from "@/helper/normalize-error.helper";

let apiClient: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
    if (apiClient) return apiClient;

    apiClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000",
        withCredentials: true,
        timeout: 15000,
    });

    apiClient.interceptors.request.use((config) => {
        return config;
    });

    let isRefreshing = false;
    let failedQueue: any[] = [];

    apiClient.interceptors.response.use(
        (response) => response,
        async (error: AxiosError<any>) => {
            const status = error.response?.status;
            const originalRequest: any = error.config;

            const isLoginPage = window.location.pathname === "/auth/login";

            if (status === 401 && !originalRequest._retry && !isLoginPage) {
                originalRequest._retry = true;

                if (isRefreshing) {
                    return new Promise((resolve) => {
                        failedQueue.push(() => {
                            resolve(apiClient!(originalRequest));
                        });
                    });
                }

                isRefreshing = true;

                try {
                    await apiClient!.post("/auth/refresh");

                    failedQueue.forEach((cb) => cb());
                    failedQueue = [];

                    return apiClient!(originalRequest);
                } catch (refreshError) {
                    window.location.href = "/auth/login";
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(normalizeError(error));
        }
    );


    return apiClient;
}