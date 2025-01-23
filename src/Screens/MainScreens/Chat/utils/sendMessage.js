import axios from "axios";

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

  let attachmentUrl = null;

  const response = await axios.get(
    `${
      import.meta.env.VITE_APP_BACKEND_URL
    }api/employeeApp/getEmployeeById/${userId}`
  );

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
      attachmentUrl = filepath;
    }

    const attachmentData = {
      attachment,
      filePath,
    };

    console.log(" before message sent", attachment);

    socket.emit("send_dm", {
      senderId: userId,
      senderName: member.name,
      messageType: "text",
      recipientId,
      content: newMessage.trim(),
      attachmentData, // Send attachment path
    });

    console.log("after message sent", attachment);

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
            createdAt: new Date().toISOString(), // timestamp of when the message was received
          }
        ];
      });
    });
    
  } else {
    // Send Channel Message
    socket.emit("send_message", {
      channelId: selectedChannel._id,
      content: newMessage.trim(),
      userId,
      messageType: "text",
      attachment, // Send attachment path
      timestamp: new Date().toISOString(),
    });

    // Remove any existing listener to avoid duplicates
    socket.off("receive_message");

    // Listen for the updated message and update the state
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: userId,
          senderImage: response.data.dp,
          senderName: member.name,
          content: newMessage.trim(),
          attachment: message.attachment, // Handle the attachment URL from the received message
          createdAt: new Date().toISOString(),
        },
      ]);
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
