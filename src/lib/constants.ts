export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  APPS: {
    LIST: "/api/apps",
    GET: "/api/apps",
    BUILD: "/api/scripts/build-app",
  },
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
  },
} as const;
