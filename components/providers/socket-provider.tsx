"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for SocketContext
type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// SocketProvider component to initialize and provide the socket connection
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize the socket connection
    const socketInstance = io('https://echowave.shiwang.tech', {
      path: '/api/socket/io', // Ensure path is correctly configured
      addTrailingSlash: false, // Avoid appending trailing slash
    });

    setSocket(socketInstance);

    // Event listeners for connection status
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.close();
    };
  }, []); // Empty dependency array ensures this only runs once on mount

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to access the socket context
export const useSocket = () => {
  return useContext(SocketContext);
};
