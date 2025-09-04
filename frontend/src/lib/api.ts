import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Generic fetch wrapper
export async function apiFetch<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
  const res = await api.request<T>({
    url: endpoint,
    ...options,
  });
  return res.data;
}

export default api;
