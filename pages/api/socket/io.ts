import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (_req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server");
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      transports: ['polling', 'websocket'], // Include both polling and websocket
      cors: {
        origin: ["https://echowave.shiwang.tech", "http://localhost:3000"], // Add your origins
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      },
      pingTimeout: 60000, // Increased timeout
      pingInterval: 25000, // Increased interval
    });

    // Optional: Add some basic event listeners
    io.on('connection', (socket) => {
      console.log('A user connected');
      
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    res.socket.server.io = io;
  }
  
  res.status(200).json({ message: "Socket.IO initialized" });
};

export default ioHandler;