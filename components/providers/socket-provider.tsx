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
    // Validate environment
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      console.error("[NEXT_PUBLIC_SITE_URL] is not defined");
      setConnectionError("Site URL not configured");
      return;
    }

    // Detailed URL construction
    const socketUrl = new URL(siteUrl);
    const protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    const fullSocketUrl = `${protocol}//${socketUrl.hostname}${socketUrl.port ? `:${socketUrl.port}` : ''}`;

    // Comprehensive socket configuration
    const socketConfig = {
      path: "/api/socket/io",
      transports: ["websocket"],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      withCredentials: false, // Changed to false if experiencing CORS issues
    };

    try {
      const socketInstance = ClientIO(fullSocketUrl, socketConfig);

      // Detailed connection logging
      console.log("Initializing Socket Connection:", {
        url: fullSocketUrl,
        config: socketConfig
      });

      // Connection success handler
      const handleConnect = () => {
        console.log("🟢 Socket connected successfully");
        setIsConnected(true);
        setConnectionError(null);
      };

      // Disconnection handler
      const handleDisconnect = (reason: string) => {
        console.warn("🔴 Socket disconnected:", reason);
        setIsConnected(false);
        setConnectionError(`Disconnection: ${reason}`);

        // Intelligent reconnection
        if (reason === "io server disconnect" || reason === "transport close") {
          setTimeout(() => {
            console.log("Attempting to reconnect...");
            socketInstance.connect();
          }, 3000);
        }
      };

      // Comprehensive error handling
      const handleConnectError = (error: any) => {
        const errorMessage = error?.message || "Unknown connection error";
        console.error("❌ Socket Connection Error:", {
          message: errorMessage,
          name: error?.name,
          type: typeof error,
          rawError: error
        });
        setConnectionError(errorMessage);
      };

      // Attach event listeners
      socketInstance.on("connect", handleConnect);
      socketInstance.on("disconnect", handleDisconnect);
      socketInstance.on("connect_error", handleConnectError);
      socketInstance.io.on("error", handleConnectError);

      // Set socket instance
      setSocket(socketInstance);

      // Cleanup function
      return () => {
        socketInstance.off("connect", handleConnect);
        socketInstance.off("disconnect", handleDisconnect);
        socketInstance.off("connect_error", handleConnectError);
        socketInstance.disconnect();
      };

    } catch (error) {
      console.error("Socket Initialization Catastrophic Failure:", error);
      setConnectionError(error instanceof Error ? error.message : "Unexpected initialization error");
    }
  }, []);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      connectionError 
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  
  // Optional: Add a hook warning if used outside provider
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};