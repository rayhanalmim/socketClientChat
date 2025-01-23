import { useState, useEffect, useRef } from "react"; // Added useRef
import useFetchChannelsAndEmployees from "./Hooks/useFetchChannelsAndEmployees";
import useSocket from "./Hooks/useSocket";
import useChatListeners from "./Hooks/useChatListeners";
import sendMessage from "./utils/sendMessage";
import { handleTyping } from "./utils/handleTyping";
import { handleSelectChannel } from "./utils/handleSelectChannel";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatPanel from "./components/ChatPanel/ChatPanel";

export default function Chat() {
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const [typingUsers, setTypingUsers] = useState([]);
  const socket = useSocket();

  const {
    currentUser,
    employees,
    channels,
    selectedChannel,
    setSelectedChannel,
    setChannels,
    setEmployees,
  } = useFetchChannelsAndEmployees();

  useChatListeners({
    socket,
    selectedChannel,
    setMessages,
    setTypingUsers,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageHandler = (e) => {
    e.preventDefault();
    sendMessage({
      socket,
      selectedChannel,
      newMessage,
      setMessages,
      setNewMessage,
    });
  };

  const handleTypingHandler = (e) => {
    handleTyping(
      e,
      socket,
      selectedChannel,
      isTyping,
      setIsTyping,
      typingTimeoutRef,
      conversationId
    );
  };

  const handleSelectChannelHandler = (employee) => {
    handleSelectChannel(employee, setConversationId, setSelectedChannel,socket);
  };

  return (
    <section className="flex h-full p-5 gap-6">
      {/* Sidebar */}
      <Sidebar
        search={search}
        setSearch={setSearch}
        socket={socket}
        setChannels={setChannels}
        setEmployees={setEmployees}
        channels={channels}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        employees={employees}
        handleSelectChannelHandler={handleSelectChannelHandler}
      />

      {/* Chat Panel */}
      <ChatPanel
      socket={socket}
      setMessages={setMessages}
        selectedChannel={selectedChannel}
        messages={messages}
        currentUser={currentUser}
        typingUsers={typingUsers}
        messagesEndRef={messagesEndRef}
        sendMessageHandler={sendMessageHandler}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleTypingHandler={handleTypingHandler}
      />
    </section>
  );
}
