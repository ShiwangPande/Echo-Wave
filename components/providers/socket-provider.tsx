"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionError: null,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const socketPath = "/api/socket/io";

    if (!siteUrl) {
      console.error("❌ [NEXT_PUBLIC_SITE_URL] is not defined");
      setConnectionError("Site URL missing");
      return;
    }

    const parseUrl = new URL(siteUrl);
    const protocol = parseUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    const hostname = parseUrl.hostname;
    const port = parseUrl.port ? `:${parseUrl.port}` : '';

    const fullSocketUrl = `${protocol}//${hostname}${port}${socketPath}`;

    console.log("🔍 Socket Connection Details:", {
      fullSocketUrl,
      socketPath,
      parsedDetails: { protocol, hostname, port: port || 'default' },
    });

    try {
      const socketInstance = ClientIO(fullSocketUrl, {
        transports: ["websocket"],
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 15000,
        withCredentials: false,
        extraHeaders: {
          'Origin': siteUrl,
        },
      });

      socketInstance.on("connect", () => {
        console.log("🟢 Socket Connected Successfully");
        setIsConnected(true);
        setConnectionError(null);
      });

      socketInstance.on("connect_error", (error: any) => {
        console.error("❌ Detailed Connection Error:", error);
        setConnectionError(error.message || "Unknown connection error");
      });

      socketInstance.on("disconnect", (reason) => {
        console.warn("🔴 Socket Disconnected:", reason);
        setIsConnected(false);
        setConnectionError(`Disconnected: ${reason}`);
      });

      socketInstance.io.on("error", (error: any) => {
        console.error("🚨 Socket.IO Core Error:", error);
        setConnectionError(error.message || "Socket.IO core error");
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } catch (error) {
      console.error("💥 Catastrophic Socket Initialization Failure:", error);
      setConnectionError(error instanceof Error ? error.message : "Unexpected initialization error");
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectionError }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
