import sendMessage from "../../../utils/sendMessage";

const handleSendMessage = (e, socket, selectedChannel, newMessage, setMessages, setNewMessage, attachment, setAttachment) => {
  e.preventDefault();
  sendMessage({
    socket,
    selectedChannel,
    newMessage,
    setMessages,
    setNewMessage,
    attachment,
    setAttachment,
  });
};

export default handleSendMessage;
