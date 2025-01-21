import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io(`${import.meta.env.VITE_APP_BACKEND_URL}anthillChat`);

    socketIo.on("connect", () => {
      console.log("Connected to socket:", socketIo.id);
    });

    setSocket(socketIo);

    return () => {
      console.log("Disconnecting socket...");
      socketIo.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
