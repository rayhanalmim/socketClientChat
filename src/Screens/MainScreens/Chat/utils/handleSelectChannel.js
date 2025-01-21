// utils/handleSelectChannel.js
export const handleSelectChannel = (employee, setConversationId, setSelectedChannel) => {
    const memberId = JSON.parse(localStorage.getItem("member"))?._id;
    const conversationId = [memberId, employee._id].sort().join("_");
    setConversationId(conversationId);
  
    setSelectedChannel({
      name: employee.name,
      employeeId: employee._id, 
      conversationId, 
      description: "Direct message",
    });
  };
  