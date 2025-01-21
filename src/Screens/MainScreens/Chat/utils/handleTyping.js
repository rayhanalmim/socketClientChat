// utils/handleTyping.js
export const handleTyping = (
    e,
    socket,
    selectedChannel,
    isTyping,
    setIsTyping,
    typingTimeoutRef,
    conversationId
  ) => {
    if (socket && selectedChannel) {
      const member = JSON.parse(localStorage.getItem("member"));
      const userId = member?._id;
  
      // Emit "typing" event only if not already typing
      if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing", {
          channelId: selectedChannel._id,
          userId,
          conversationId,
        });
      }
  
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
  
      // Set a new timeout for detecting typing stop
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false); // Reset typing status
        socket.emit("stop_typing", {
          channelId: selectedChannel._id,
          userId,
          conversationId,
        });
      }, 1000); // 1 second after the last key press
    }
  };
  