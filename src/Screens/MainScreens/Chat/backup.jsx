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
import { io } from "socket.io-client";
import { useDebounce } from "../../../Hooks/useDebounce"; // Imported useDebounce hook

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null); // Default to no channel
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom when new messages come

  const [typingUsers, setTypingUsers] = useState([]); // Store typing users
  const typingTimeoutRef = useRef(null); // Store the typing timeout

  // Fetch channels from the API
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5010/api/channel/channels"
        );
        setChannels(response.data); // Assuming API returns an array of channels
        setSelectedChannel(response.data[0]); // Set the first channel as default
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannels();
  }, []);

  // Initialize socket on mount
  useEffect(() => {
    const socketIo = io("http://localhost:5010/anthillChat");

    socketIo.on("connect", () => {
      console.log("Connected to socket:", socketIo.id);
    });

    setSocket(socketIo);

    return () => {
      console.log("Disconnecting socket...");
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && selectedChannel) {
      const member = JSON.parse(localStorage.getItem("member"));
      const userId = member?._id;
  
      // First leave the previous channel
      socket.emit("leave_channel", { channelId: selectedChannel._id, userId });
  
      // Join the new channel after leaving the old one
      socket.emit("join_channel", { channelId: selectedChannel._id, userId });
  
      // Listener for error events
      const errorListener = (errorMessage) => {
        console.log("Error:", errorMessage);
        alert(`Error: ${errorMessage}`); // You can show a custom error message or alert here
      };
  
      // Listener for message history
      const messageHistoryListener = (data) => {
        console.log("Message history received:", data);
        setMessages(data.reverse()); // Reverse the messages so the latest appears at the bottom
      };
  
      // Listener for new messages
      const messageListener = (data) => {
        console.log("Message received:", data);
  
        setMessages((prev) => {
          // Only add the message if it is from a different sender than the last one
          if (userId === data.senderId) {
            return prev; // Don't add the message if it's from the same sender
          }
          return [...prev, data]; // Add the new message
        });
  
        // Log after the state update to capture the updated state correctly
        setTimeout(() => {
          console.log("from message listener", messages);
        }, 0); // Ensure it logs after the next render cycle
      };
  
      // Listener for typing events
      const typingListener = ({ userId, name }) => {
        setTypingUsers((prev) => [...prev, { userId, name }]);
      };
  
      // Listener for stop typing events
      const stopTypingListener = ({ userId }) => {
        setTypingUsers((prev) => prev.filter((user) => user.userId !== userId));
      };
  
      // Register all listeners
      socket.on("error", errorListener);
      socket.on("message_history", messageHistoryListener);
      socket.on("receive_message", messageListener);
      socket.on("typing", typingListener);
      socket.on("stop_typing", stopTypingListener);
  
      return () => {
        console.log("Cleanup for channel:", selectedChannel.name);
  
        // Remove all listeners to prevent memory leaks
        socket.off("error", errorListener);
        socket.off("message_history", messageHistoryListener);
        socket.off("receive_message", messageListener);
        socket.off("typing", typingListener);
        socket.off("stop_typing", stopTypingListener);
      };
    }
  }, [socket, selectedChannel]); // Dependencies for reinitializing listeners
  

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log("here is the messages", messages);

  

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return; // Prevent sending empty messages
    const member = JSON.parse(localStorage.getItem("member"));
    const userId = member?._id;

    const messageData = {
      channelId: selectedChannel._id,
      content: newMessage.trim(), // Ensure content is trimmed
      userId,
      messageType: "text",
      attachments: [],
      timestamp: new Date().toISOString(),
    };

    console.log("Sending message:", messageData);

    // Send the message
    socket.emit("send_message", messageData);

    // Update the local messages state with the new message
    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        senderName: member.name,
        content: newMessage.trim(), // Ensure content is trimmed
        createdAt: new Date().toISOString(),
      },
    ]);

    // Clear the input field after sending
    setNewMessage("");
  };

  // Typing handler function
  const handleTyping = () => {
    console.log("user in typing");

    const member = JSON.parse(localStorage.getItem("member"));
    const userId = member?._id;

    // Emit 'typing' event when the user starts typing
    socket.emit("typing", { channelId: selectedChannel._id, userId });

    console.log("after boardcast typing");
    // Reset the timeout to stop emitting 'typing' after a delay
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { channelId: selectedChannel._id, userId });
    }, 1000); // Stop typing after 1 second of inactivity
  };

  console.log("typingUsers", typingUsers);

  return (
    <section className="flex h-full p-5 gap-6">
      {/* Sidebar */}
      <div className="flex flex-col gap-2 w-1/4">
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

        {/* Channel List */}
        <div className="flex flex-col gap-2">
          {channels.map((channel) => (
            <Button
              key={channel._id}
              className={`w-full text-left p-2 ${
                selectedChannel?._id === channel._id
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
              onClick={() => setSelectedChannel(channel)}
            >
              {channel.name}
            </Button>
          ))}
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

        <div className="flex flex-col flex-1 overflow-y-auto p-4 gap-2">
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
                    : "self-start rounded-[16px_16px_16px_0] bg-secondary"
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

          <div>
            {typingUsers.length > 0 && (
              <p>
                {typingUsers.map((user) => (
                  <span key={user.userId}>{user.name} is typing...</span>
                ))}
              </p>
            )}
          </div>

          {/* Ref for scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>

        <form className="flex gap-2 p-4" onSubmit={sendMessage}>
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
              onChange={(e) => setNewMessage(e.target.value)}
              onFocus={handleTyping} // Detect typing when input is focused
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
