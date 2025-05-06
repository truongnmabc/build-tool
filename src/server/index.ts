import cors from "cors";
import express from "express";
import { createServer } from "http";
import next from "next";
import { initSocket } from "../lib/socket";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  // CORS configuration
  server.use(
    cors({
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5070",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

  // Initialize Socket.IO
  initSocket(httpServer);

  // Handle all other routes with Next.js
  server.use((req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 5070;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
