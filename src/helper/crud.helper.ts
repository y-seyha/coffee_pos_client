import { api } from "@/api/api";
import { AxiosResponse } from "axios";

export const apiService = {
  get: async <T>(url: string): Promise<T> => {
    const res: AxiosResponse<T> = await api.get(url);
    return res.data;
  },

  post: async <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
  ): Promise<TResponse> => {
    const res: AxiosResponse<TResponse> = await api.post(url, data);
    return res.data;
  },

  put: async <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
  ): Promise<TResponse> => {
    const res: AxiosResponse<TResponse> = await api.put(url, data);
    return res.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const res: AxiosResponse<T> = await api.delete(url);
    return res.data;
  },
};
