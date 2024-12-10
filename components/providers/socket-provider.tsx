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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const socketPath = "/api/socket/io";

    if (!siteUrl) {
      console.error("[NEXT_PUBLIC_SITE_URL] is not defined");
      return;
    }

    // Construct socket URL dynamically
    const socketUrl = new URL(siteUrl);
    const protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    const fullSocketUrl = `${protocol}//${socketUrl.hostname}${socketUrl.port ? `:${socketUrl.port}` : ''}`;

    try {
      const socketInstance = ClientIO(fullSocketUrl, {
        path: socketPath,
        transports: ["websocket"],
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        timeout: 5000,
        withCredentials: true,
      });

      setSocket(socketInstance);

      const connectHandler = () => {
        console.log("Socket connected successfully");
        setIsConnected(true);
      };

      const disconnectHandler = (reason: string) => {
        console.warn("Socket disconnected:", reason);
        setIsConnected(false);

        if (reason === "io server disconnect" || reason === "transport close") {
          setTimeout(() => socketInstance.connect(), 3000);
        }
      };

      const connectErrorHandler = (error: any) => {
        console.error("Socket Connection Error:", {
          name: error?.name,
          message: error?.message,
          type: typeof error,
        });
      };

      socketInstance.on("connect", connectHandler);
      socketInstance.on("disconnect", disconnectHandler);
      socketInstance.on("connect_error", connectErrorHandler);
      socketInstance.io.on("error", connectErrorHandler);

      return () => {
        socketInstance.off("connect", connectHandler);
        socketInstance.off("disconnect", disconnectHandler);
        socketInstance.off("connect_error", connectErrorHandler);
        socketInstance.disconnect();
      };
    } catch (error) {
      console.error("Socket Initialization Failed:", error);
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);