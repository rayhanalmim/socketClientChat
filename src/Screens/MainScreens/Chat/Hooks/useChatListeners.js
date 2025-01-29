import { useEffect } from "react";

const useChatListeners = ({
  socket,
  selectedChannel,
  setMessages,
  setTypingUsers,
}) => {
  useEffect(() => {
    if (socket && selectedChannel) {
      const member = JSON.parse(localStorage.getItem("member"));
      const userId = member?._id;
      socket.emit("user_online", { userId });

      const dmMessageListener = (data) => {
        console.log("data from the dmMessageListener xxxxxxxxxxxxx", data);
        setMessages((prev) => {
          // if (userId === data.senderId) {
          //   return prev;
          // }
          return [...prev, data];
        });
      };

      if (selectedChannel.conversationId) {
        if (selectedChannel._id) {
          socket.emit("leave_dm", { conversationId: selectedChannel._id });
        }

        socket.emit("join_dm", {
          conversationId: selectedChannel.conversationId,
          userId,
        });

        console.log("join dm successfully");

        socket.on("private_message_history", (data) => {
          setMessages(data.reverse());
        });

        socket.on("recived_dm", dmMessageListener);
      } else {
        if (selectedChannel._id) {
          socket.emit("leave_channel", {
            channelId: selectedChannel._id,
            userId,
          });
        }

        socket.emit("join_channel", { channelId: selectedChannel._id, userId });
      }

      const errorListener = (errorMessage) => {
        console.error("Error:", errorMessage);
        alert(`Error: ${errorMessage}`);
      };

      const messageHistoryListener = (data) => {
        setMessages(data.reverse());

        console.log('recived data inside the histoty listener', data);

        if (selectedChannel._id) {
        }
        socket.emit("mark_message_seen", {
          channelId: selectedChannel._id,
          userId,
          messageId: data[data.length - 1]._id,
        });

        socket.on('message_seen_update', ({
          messageId,
          seenUsers,
        }) => {
             console.log("here is the message seen", messageId, seenUsers);
        });
      };

      const messageListener = (data) => {
        setMessages((prev) => {
          // if (userId === data.senderId) {
          //   return prev;
          // }
          return [...prev, data];
        });
      };

      const messageEditListener = ({ messageId, newContent, edited }) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId
              ? { ...msg, content: newContent, edited }
              : msg
          )
        );
      };

      const typingListener = ({ userId, name, conversationId, channelId }) => {
        setTypingUsers((prev) => [
          ...prev,
          { userId, name, conversationId, channelId },
        ]);
      };

      const stopTypingListener = ({ userId }) => {
        setTypingUsers((prev) => prev.filter((user) => user.userId !== userId));
      };

      socket.on("error", errorListener);
      socket.on("message_history", messageHistoryListener);
      socket.on("receive_message", messageListener);
      socket.on("message_edited", messageEditListener);
      socket.on("typing", typingListener);
      socket.on("stop_typing", stopTypingListener);

      return () => {
        socket.off("user_online");
        socket.off("private_message_history");
        socket.off("send_dm", dmMessageListener);
        socket.off("recived_dm");
        socket.off("error", errorListener);
        socket.off("message_history", messageHistoryListener);
        socket.off("receive_message", messageListener);
        socket.off("message_edited", messageEditListener);
        socket.off("typing", typingListener);
        socket.off("stop_typing", stopTypingListener);
      };
    }
  }, [socket, selectedChannel, setMessages, setTypingUsers]);
};

export default useChatListeners;
