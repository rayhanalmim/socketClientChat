/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"; // Added useRef
import axios from "axios";
import { format } from "date-fns";
import {
  IconArrowLeft,
  IconMessages,
  IconSearch,
  IconSend,
  IconPlus,
  IconPhotoPlus,
  IconPaperclip,
} from "@tabler/icons-react";
import { Button } from "@antopolis/admin-component-library/dist/input-otp-BqpTxPZb";
import { cn } from "@antopolis/admin-component-library/dist/form-B8zjCsro";
import useFetchChannelsAndEmployees from "./Hooks/useFetchChannelsAndEmployees";
import useSocket from "./Hooks/useSocket";
import useChatListeners from "./Hooks/useChatListeners";
import sendMessage from "./utils/sendMessage"; 
import { handleTyping } from "./utils/handleTyping"; 
import { handleSelectChannel } from "./utils/handleSelectChannel";

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
      setNewMessage
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
    handleSelectChannel(employee, setConversationId, setSelectedChannel);
  };

  return (
    <section className="flex h-full p-5 gap-6">
      {/* Sidebar */}
      <div className="flex flex-col gap-2 w-1/4 max-h-[100vh]">
        <div className="sticky top-0 z-10 bg-background px-4 pb-3 shadow-md">
          <div className="flex items-center justify-between py-2">
            <div className="flex gap-2">
              <h1 className="text-2xl font-bold">Channels</h1>
              <IconMessages size={20} />
            </div>
          </div>

          <label className="flex h-12 w-full items-center rounded-md border px-2">
            <IconSearch size={15} className="mr-2 stroke-slate-500" />
            <input
              type="text"
              className="w-full bg-inherit text-sm"
              placeholder="Search chat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <div className="flex-1 overflow-auto border-b">
            <h2 className="text-lg font-semibold px-4 mb-3">Joined Channels</h2>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {channels.map((channel) => (
                <Button
                  key={channel._id}
                  className={`w-full text-left p-2 ${
                    selectedChannel?._id === channel._id
                      ? "bg-primary text-black"
                      : "bg-secondary text-muted-foreground"
                  }`}
                  onClick={() => setSelectedChannel(channel)}
                >
                  {channel.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <h2 className="text-lg font-semibold px-4 mb-3">Direct Messages</h2>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {employees.map((employee) => (
                <Button
                  key={employee._id}
                  className={`w-full text-left p-2 ${
                    selectedChannel?.conversationId ===
                    [
                      JSON.parse(localStorage.getItem("member"))?._id,
                      employee._id,
                    ]
                      .sort()
                      .join("_")
                      ? "bg-primary text-black"
                      : "bg-secondary text-muted-foreground"
                  }`}
                  onClick={() => handleSelectChannelHandler(employee)}
                >
                  {employee.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="w-3/4 flex flex-col rounded-md border bg-primary-foreground shadow-sm">
        <div className="mb-1 flex justify-between bg-secondary p-4 shadow-lg">
          <div className="flex gap-3">
            <Button size="icon" variant="ghost" className="-ml-2">
              <IconArrowLeft />
            </Button>
            <div>
              <span className="text-sm font-medium">
                {selectedChannel?.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {selectedChannel?.description}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-1">
          {messages.map((msg, index) => {
            // Skip rendering messages with empty content
            if (!msg?.content.trim()) return null; // Skip empty messages
            return (
              <div
                key={index}
                className={cn(
                  "max-w-72 px-3 py-2 shadow-lg",
                  msg.senderId ===
                    JSON.parse(localStorage.getItem("member"))?._id
                    ? "self-end rounded-[16px_16px_0_16px] bg-primary/85 text-white"
                    : "self-start rounded-[16px_16px_16px_0] bg-primary/85 text-white"
                )}
              >
                <div className="font-semibold text-red-300">
                  {msg?.senderName}
                </div>
                <div className="">{msg?.content}</div>
                {msg.attachments?.length > 0 && (
                  <div className="mt-2">
                    {msg.attachments.map((attachment, idx) => (
                      <a
                        key={idx}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {attachment.name || "Attachment"}
                      </a>
                    ))}
                  </div>
                )}
                <span className="block mt-1 text-xs font-light text-muted-foreground">
                  {msg?.createdAt && format(new Date(msg.createdAt), "h:mm a")}
                </span>
              </div>
            );
          })}

          <div className="my-1">
            {typingUsers.length > 0 && (
              <p className="text-gray-500 text-sm italic my-1">
                {typingUsers
                  .filter((user) => user.userId !== currentUser._id) // Filter out current user's typing indicator
                  .map((user, index) => (
                    <span key={user.userId}>
                      {user.name} is typing
                      {index === typingUsers.length - 1 ? "..." : ","}{" "}
                    </span>
                  ))}
              </p>
            )}
          </div>

          {/* Ref for scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>

        <form className="flex gap-2 p-4" onSubmit={sendMessageHandler}>
          <div className="flex flex-1 items-center gap-2 rounded-md border px-2 py-1">
            <div className="space-x-1">
              <Button size="icon" type="button" variant="ghost">
                <IconPlus size={20} />
              </Button>
              <Button size="icon" type="button" variant="ghost">
                <IconPhotoPlus size={20} />
              </Button>
              <Button size="icon" type="button" variant="ghost">
                <IconPaperclip size={20} />
              </Button>
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-inherit"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value); // Update message state
                handleTypingHandler(e);  // Trigger typing event on every input change
              }} // Detect typing when input is focused
            />
            <Button type="submit" size="icon" variant="ghost">
              <IconSend size={20} />
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
