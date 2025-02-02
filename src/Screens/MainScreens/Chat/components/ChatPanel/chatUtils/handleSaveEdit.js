const handleSaveEdit = async (messageId, editedMessageContent, socket, currentUser, selectedChannel, setEditingMessageId, setEditedMessageContent) => {
    if (editedMessageContent.trim()) {
      console.log("Editing message:", { messageId, editedMessageContent });
  
      try {
        if (!messageId) {
          console.error("Invalid message ID");
          return;
        }
  
        socket.emit("edit_message", {
          messageId,
          newContent: editedMessageContent,
          userId: currentUser._id,
          channelId: selectedChannel._id,
          conversationId: selectedChannel.conversationId,
        });
  
        setEditingMessageId(null);
        setEditedMessageContent("");
      } catch (error) {
        console.error("Error editing message:", error);
      }
    }
  };
  
  export default handleSaveEdit;
  