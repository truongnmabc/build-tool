"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const react_1 = require("next-auth/react");
const axiosInstance = axios_1.default.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5070",
    headers: {
        "Content-Type": "application/json",
    },
});
// Add a request interceptor
axiosInstance.interceptors.request.use(async (config) => {
    try {
        const session = await (0, react_1.getSession)();
        if (session === null || session === void 0 ? void 0 : session.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        return config;
    }
    catch (error) {
        console.error("Error getting session:", error);
        return config;
    }
}, (error) => {
    return Promise.reject(error);
});
// Add a response interceptor
axiosInstance.interceptors.response.use((response) => response, async (error) => {
    var _a;
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
        // Only redirect if we're not already on the signin page
        if (!window.location.pathname.startsWith("/auth/signin")) {
            window.location.href = "/auth/signin";
        }
    }
    return Promise.reject(error);
});
exports.default = axiosInstance;
