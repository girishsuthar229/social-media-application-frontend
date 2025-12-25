import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socketURL = process.env.NEXT_PUBLIC_API_URL;

const useSocket = (userId: string | undefined) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (userId) {
      const socketInstance = io(socketURL, {
        query: { userId },
      });

      setSocket(socketInstance);
      socketInstance.on("connect", () => {
        console.log(`Socket connected`);
      });
      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      return () => {
        socketInstance.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [userId]);

  return socket;
};

export default useSocket;
