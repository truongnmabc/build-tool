import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5070",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    } catch (error) {
      console.error("Error getting session:", error);
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the signin page
      if (!window.location.pathname.startsWith("/auth/signin")) {
        window.location.href = "/auth/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
