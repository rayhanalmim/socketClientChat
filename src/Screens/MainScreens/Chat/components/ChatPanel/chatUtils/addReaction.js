const addReaction = (messageId, emoji, socket, userId) => {
    console.log("Add reaction triggered", { messageId, emoji, userId });
    socket.emit("add_reaction", {
      messageId,
      emoji,
      userId,
    });
  };
  
  export default addReaction;
  