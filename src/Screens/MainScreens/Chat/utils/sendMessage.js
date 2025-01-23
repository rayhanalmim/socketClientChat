const sendMessage = async ({
  socket,
  selectedChannel,
  newMessage,
  setAttachment,
  setMessages,
  setNewMessage,
  attachment, // New argument to handle the file
}) => {
  console.log("hit send message", attachment);

  const member = JSON.parse(localStorage.getItem("member"));
  const userId = member?._id;

  if (selectedChannel.conversationId) {
    // Send DM
    const recipientId = selectedChannel.employeeId;
    if (!recipientId) {
      console.error("Recipient ID could not be determined.");
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
      attachmentData, // Send attachment path
    });

      // Emit an event to update the unread count for the recipient
      socket.emit("fetch_unread_count", {
        userId: recipientId,
        conversationId: selectedChannel.conversationId,
      });
  


    // Remove any existing listener to avoid duplicates
    socket.off("recived_dm");

    // Listen for the updated message after it is saved and pushed to the channel
    socket.on("recived_dm", (message) => {
      setMessages((prevMessages) => {
        // Append the new message to the existing messages
        return [
          ...prevMessages,
          {
            senderId: message.senderId, // sender ID from the message data
            senderImage: message.senderImage, // sender's image URL from the message data
            senderName: message.senderName, // sender's name from the message data
            content: message.content, // the content of the message
            attachment: message.attachment, // the attachment URL if any
            createdAt: message.createdAt, // timestamp of when the message was received
          },
        ];
      });
    });
  } else {
    let filePath = null;

    if (attachment) {
      const filepath = `antschat/${Date.now()}.${attachment.name}`;
      filePath = filepath;
    }

    const attachmentData = {
      attachment,
      filePath,
    };


    // Send Channel Message
    socket.emit("send_message", {
      channelId: selectedChannel._id,
      content: newMessage.trim(),
      userId,
      messageType: "text",
      attachment, // Send attachment path
      attachmentData,
      timestamp: new Date().toISOString(),
    });

    // Remove any existing listener to avoid duplicates
    socket.off("receive_message");
 

    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            senderId: message.senderId,
            senderImage: message.senderImage,
            senderName: message.senderName,
            content: message.content,
            attachment: message.attachment, // Handle the attachment URL from the received message
            createdAt: message.createdAt,
          },
        ];
      });
    });
  }

  // Clear the input fields after sending
  setNewMessage("");
  setAttachment(null); // Reset attachment after sending

  return () => {
    // Remove listeners to avoid memory leaks
    socket.off("recived_dm");
    socket.off("send_dm");
    socket.off("receive_message");
  };
};

export default sendMessage;
