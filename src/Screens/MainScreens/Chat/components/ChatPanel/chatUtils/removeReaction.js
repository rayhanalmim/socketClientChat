const removeReaction = (messageId, emoji, socket, userId) => {
    console.log("Remove reaction triggered", { messageId, emoji, userId });
    socket.emit("remove_reaction", {
      messageId,
      emoji,
      userId,
    });
  };
  
  export default removeReaction;
  