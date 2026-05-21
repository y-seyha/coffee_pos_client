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

    let isRedirecting = false;

    apiClient.interceptors.response.use(
        (response) => response,
        (error: AxiosError<any>) => {
            const status = error.response?.status;

            const isLoginPage = window.location.pathname === "/auth/login";

            if (status === 401) {
                console.warn("Unauthorized");

                if (!isRedirecting && !isLoginPage) {
                    isRedirecting = true;

                    window.location.href = "/auth/login";
                }
            }

            return Promise.reject(normalizeError(error));
        }
    );


    return apiClient;
}