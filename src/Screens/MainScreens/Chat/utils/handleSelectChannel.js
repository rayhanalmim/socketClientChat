// utils/handleSelectChannel.js
export const handleSelectChannel = (
  employee,
  setConversationId,
  setSelectedChannel,
  socket,
) => {
  const memberId = JSON.parse(localStorage.getItem("member"))?._id;
  const conversationId = [memberId, employee._id].sort().join("_");
  setConversationId(conversationId);

  socket.emit("check_user_presence", { userId: employee._id });

  // Listen for the presence response
  socket.on("user_presence_status", ({  status, lastSeen }) => {
    setSelectedChannel((prevChannel) => ({
      ...prevChannel,
      name: employee.name,
      employeeId: employee._id,
      conversationId,
      description: "Direct message",
      presence: { status, lastSeen }, // Add presence info
    }));
  });
};
