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
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      transports: ['websocket', 'polling'],
      addTrailingSlash: false,
      cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"], // Allow GET and POST methods
        allowedHeaders: ["Content-Type"], // Specify any allowed headers
      },
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
