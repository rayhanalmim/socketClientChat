import { useEffect } from "react";
import { toast } from "react-toastify";

export const useSocketEvents = ({ socket, selectedChannel, userId, setMessages }) => {
  useEffect(() => {
    if (!socket || !selectedChannel) return;

    console.log("channel change triggered from chat panel", selectedChannel);

    socket.on("error", (clientMessage) => {
      toast.error(clientMessage);
      console.error(clientMessage);
    });

    if (selectedChannel._id) {
      socket.emit("join_channel", { channelId: selectedChannel._id, userId });
    } else if (selectedChannel.conversationId) {
      socket.emit("join_dm", { conversationId: selectedChannel.conversationId, userId });
    }

    socket.on("reaction_updated", ({ messageId, reactions }) => {
      console.log("reaction_updated event received:", messageId, reactions);

      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg._id === messageId ? { ...msg, reactions } : msg))
      );
    });

    return () => {
      if (selectedChannel._id) {
        socket.emit("leave_channel", { channelId: selectedChannel._id });
      }
      if (selectedChannel.conversationId) {
        socket.emit("leave_dm", { conversationId: selectedChannel.conversationId });
      }
      socket.off("reaction_updated");
      socket.off("error");
    };
  }, [socket, selectedChannel]);
};
