"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Validate environment variable
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const socketPath = "/api/socket/io";

    if (!siteUrl) {
      console.error("[NEXT_PUBLIC_SITE_URL] is not defined");
      return;
    }

    try {
      const socketInstance = ClientIO(siteUrl, {
        path: socketPath,
        transports: ["websocket", "polling"],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 5000
      });

      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        console.log("Socket connected successfully");
        setIsConnected(true);
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);

        // Attempt to reconnect if disconnected due to server issues
        if (reason === "io server disconnect") {
          socketInstance.connect();
        }
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Detailed Socket Connection Error:", {
          name: error.name,
          message: error.message,
          description: error.cause
        });
      });

      socketInstance.on("reconnect", (attemptNumber) => {
        console.log(`Reconnected to socket after ${attemptNumber} attempts`);
      });

      socketInstance.on("reconnect_error", (error) => {
        console.error("Reconnection Error:", error);
      });

      return () => {
        socketInstance.disconnect();
      };
    } catch (error) {
      console.error("Failed to initialize socket:", error);
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};