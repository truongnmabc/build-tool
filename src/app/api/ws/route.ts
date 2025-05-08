import { NextResponse } from "next/server";
import { Server, Socket } from "socket.io";

declare global {
  var io: Server | undefined;
}

const ioHandler = (req: Request) => {
  if (!global.io) {
    console.log("New Socket.io server...");
    global.io = new Server({
      path: "/api/ws",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL,
        methods: ["GET", "POST"],
      },
    });

    global.io.on("connection", (socket: Socket) => {
      console.log("Socket connected!", socket.id);

      socket.on("disconnect", () => {
        console.log("Socket disconnected!", socket.id);
      });
    });
  }

  return NextResponse.json(
    { success: true },
    {
      status: 200,
    }
  );
};

export const GET = ioHandler;
export const POST = ioHandler;
