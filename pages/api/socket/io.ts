import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

// Disable body parsing to handle WebSocket connections properly
export const config = {
  api: {
    bodyParser: false, // This is important for WebSocket support
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  console.log(req.method);

  // Initialize Socket.IO only once
  if (!res.socket.server.io) {
    const path = "/api/socket/io"; // This is the WebSocket path
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path: path,
      transports: ["websocket", "polling"], // Fallback transports
      cors: {
        origin: "*", // You can specify allowed origins here for production
        methods: ["GET", "POST"],
      },
    });

    // Store the Socket.IO instance in the server object to avoid reinitialization
    res.socket.server.io = io;

    // Handle new connections and disconnections
    io.on("connection", (socket) => {
      console.log("A client connected");

      socket.on("disconnect", () => {
        console.log("A client disconnected");
      });

      socket.on("message", (data) => {
        console.log("Received message:", data);
      });
    });
  }

  // Respond with an empty response to finalize the request
  res.end();
};

export default ioHandler;
