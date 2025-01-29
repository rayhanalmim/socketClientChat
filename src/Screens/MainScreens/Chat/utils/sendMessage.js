const sendMessage = async ({
  socket,
  selectedChannel,
  newMessage,
  setAttachment,
  setMessages,
  setNewMessage,
  attachment,
}) => {
  console.log("Sending message:", attachment);

  const member = JSON.parse(localStorage.getItem("member"));
  const userId = member?._id;

  if (selectedChannel.conversationId) {
    // Sending a direct message
    const recipientId = selectedChannel.employeeId;

    if (!recipientId) {
      console.error("Recipient ID is undefined.");
      return;
    }

    let filePath = null;

    if (attachment) {
      const filepath = `antschat/${Date.now()}.${attachment.name}`;
      filePath = filepath;
    }

    const attachmentData = {
      attachment,
      filePath,
    };

    socket.emit("send_dm", {
      senderId: userId,
      senderName: member.name,
      messageType: "text",
      recipientId,
      content: newMessage.trim(),
      attachmentData,
    });

    // Listen for the real-time message event
    socket.off("recived_dm"); // Remove any existing listener to avoid duplicates
    socket.on("recived_dm", (message) => {

      console.log("Received DM:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: message.senderId,
          senderImage: message.senderImage,
          senderName: message.senderName,
          content: message.content,
          attachment: message.attachment,
          createdAt: message.createdAt,
        },
      ]);
    });
  } else {
    // Sending a channel message
    let filePath = null;

    if (attachment) {
      const filepath = `antschat/${Date.now()}.${attachment.name}`;
      filePath = filepath;
    }

    const attachmentData = {
      attachment,
      filePath,
    };

    socket.emit("send_message", {
      channelId: selectedChannel._id,
      content: newMessage.trim(),
      userId,
      messageType: "text",
      attachmentData,
      timestamp: new Date().toISOString(),
    });

    socket.off("receive_message");
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: message.senderId,
          senderImage: message.senderImage,
          senderName: message.senderName,
          content: message.content,
          attachment: message.attachment,
          createdAt: message.createdAt,
        },
      ]);
    });
  }

  // Clear input and attachment fields
  setNewMessage("");
  setAttachment(null);

  return () => {
    socket.off("recived_dm");
    socket.off("send_dm");
    socket.off("receive_message");
  };
};


export default sendMessage;
