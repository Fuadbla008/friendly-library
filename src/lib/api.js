import axios from "axios";
import { authClient } from "@/lib/auth-client";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

api.interceptors.request.use(async (config) => {
  try {
    const { data } = await authClient.token();
    if (data?.token) {
      config.headers.Authorization = `Bearer ${data.token}`;
    }
  } catch {
    // Public requests such as GET /books do not need a token.
  }
  return config;
});

export function apiErrorMessage(error, fallback = "Something went wrong.") {
  return error?.response?.data?.message || error?.message || fallback;
}
