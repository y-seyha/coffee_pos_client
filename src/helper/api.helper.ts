import {AxiosRequestConfig} from "axios";
import {getApiClient} from "@/helper/axios.helper";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export async function apiRequest<TResponse, TBody = unknown>(
    method: HttpMethod,
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig
): Promise<TResponse> {
  const client = getApiClient();

  const response = await client.request<TResponse>({
    method,
    url,
    data: body,
    ...config,
  });

  return response.data;
}