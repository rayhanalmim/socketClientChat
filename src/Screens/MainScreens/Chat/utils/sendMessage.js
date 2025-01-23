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
 

  console.log('hit send message', attachment)

  const member = JSON.parse(localStorage.getItem("member"));
  const userId = member?._id;

  let attachmentUrl = null;

  const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}api/employeeApp/getEmployeeById/${userId}`);

  // Prepare attachment data if any
  // let attachmentData = null;
  // if (attachment) {
  //   const filePath = `antschat/${Date.now()}-${attachment.name}`;
  //   attachmentData = filePath; // Pass only the file path to the backend (no actual file upload here)
  // }

  if (selectedChannel.conversationId) {
    // Send DM
    const recipientId = selectedChannel.employeeId;
    if (!recipientId) {
      console.error("Recipient ID could not be determined.");
      return;
    }

    let filePath = null;

    if(attachment){
      const filepath = `antschat/${Date.now()}.${attachment.name}`;
      filePath = filepath;
      attachmentUrl = filepath;
    }

    const attachmentData = {
      attachment,
      filePath
    }

    console.log(' before message sent', attachment)

    socket.emit("send_dm", {
      senderId: userId,
      senderName: member.name,
      messageType: "text",
      recipientId,
      content: newMessage.trim(),
      attachmentData, // Send attachment path
    });

    console.log("after message sent", attachment)
    
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
  }

  // Update the local messages state with the new message
  setMessages((prev) => [
    ...prev,
    {
      senderId: userId,
      senderImage: response.data.dp,
      senderName: member.name,
      content: newMessage.trim(),
      attachment: attachmentUrl, // Include the attachment path in the state
      createdAt: new Date().toISOString(),
    },
  ]);

  // Clear the input fields after sending
  setNewMessage("");
  setAttachment(null); // Reset attachment after sending
};

export default sendMessage;
