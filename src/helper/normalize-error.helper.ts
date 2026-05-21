import { AxiosError } from "axios";

export type ApiError = {
    message: string;
    status?: number;
    details?: any;
};

export function normalizeError(error: AxiosError<any>): ApiError {
    return {
        message:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        status: error.response?.status,
        details: error.response?.data,
    };
}