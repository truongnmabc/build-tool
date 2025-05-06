"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const next_1 = __importDefault(require("next"));
const socket_1 = require("../lib/socket");
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const server = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(server);
    // CORS configuration
    server.use((0, cors_1.default)({
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5070",
        methods: ["GET", "POST"],
        credentials: true,
    }));
    // Initialize Socket.IO
    (0, socket_1.initSocket)(httpServer);
    // Handle all other routes with Next.js
    server.use((req, res) => {
        return handle(req, res);
    });
    const PORT = process.env.PORT || 5070;
    httpServer.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
