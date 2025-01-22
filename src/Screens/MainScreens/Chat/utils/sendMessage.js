import axios from "axios";

const sendMessage = async({ socket, selectedChannel, newMessage, setMessages, setNewMessage }) => {
    if (!newMessage.trim() || !socket) return; // Prevent sending empty messages
    const member = JSON.parse(localStorage.getItem("member"));
    const userId = member?._id;

    const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}api/employeeApp/getEmployeeById/${userId}`);

    console.log("user from the db : ", response.data);
  
    if (selectedChannel.conversationId) {
      // Send DM
      const recipientId = selectedChannel.employeeId;
      if (!recipientId) {
        console.error("Recipient ID could not be determined.");
        return;
      }
  
      socket.emit("send_dm", {
        senderId: userId,
        senderName: member.name,
        recipientId,
        content: newMessage.trim(),
      });
    } else {
      // Send Channel Message
      socket.emit("send_message", {
        channelId: selectedChannel._id,
        content: newMessage.trim(),
        userId,
        messageType: "text",
        attachments: [],
        timestamp: new Date().toISOString(),
      });
    }
  
    // Update the local messages state with the new message
    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        senderImage : response.data.dp,
        senderName: member.name,
        content: newMessage.trim(), // Ensure content is trimmed
        createdAt: new Date().toISOString(),
      },
    ]);
  
    // Clear the input field after sending
    setNewMessage("");
  };
  
  export default sendMessage;
  