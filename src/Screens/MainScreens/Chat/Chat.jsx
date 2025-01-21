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
import { io } from "socket.io-client";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null); // Default to no channel
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom when new messages come
  const typingTimeoutRef = useRef(null); // Ref to manage the typing timeout
  const [isTyping, setIsTyping] = useState(false); // Track if typing is already active
  const [employees, setEmployees] = useState([]);
  const [currentUser, setcurrentUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  const [typingUsers, setTypingUsers] = useState([]); // Store typing users

  useEffect(() => {
    const fetchChannelsAndEmployee = async () => {
      try {
        const member = JSON.parse(localStorage.getItem("member"));
        const userId = member?._id;
        setcurrentUser(member);

        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_BACKEND_URL
          }api/channel/getDmUser/${userId}`
        );

        const responseEmployee = await axios.get(
          `${
            import.meta.env.VITE_APP_BACKEND_URL
          }api/employeeApp/getAllEmployees/${userId}`
        );
        setEmployees(responseEmployee.data);

        console.log(response.data);
        setChannels(response.data); // Assuming API returns an array of channels
        setSelectedChannel(response.data[0]); // Set the first channel as default
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannelsAndEmployee();
  }, []);

  // Initialize socket on mount
  useEffect(() => {
    const socketIo = io(`${import.meta.env.VITE_APP_BACKEND_URL}anthillChat`);

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

      // New message listener
      const dmMessegeListener = (data) => {
        console.log("Message received:", data);
        setMessages((prev) => {
          if (userId === data.senderId) {
            return prev; // Ignore messages sent by the same user
          }
          return [...prev, data];
        });
      };

      console.log(
        "selectedChannel.conversationId",
        selectedChannel.conversationId
      );

      if (selectedChannel.conversationId) {
        // Direct Message logic

        // Leave the previous channel
        if (selectedChannel._id) {
          socket.emit("leave_channel", {
            channelId: selectedChannel._id,
            userId,
          });
        }

        const [senderId, recipientId] =
          selectedChannel.conversationId.split("_");

        console.log("reciption id", recipientId);

        socket.emit("join_dm", {
          conversationId: selectedChannel.conversationId,
        });

        socket.on("private_message_history", (data) => {
          setMessages(data.reverse());
        });

        socket.on("recived_dm", dmMessegeListener);
      } else {
        // Leave the previous channel
        if (selectedChannel._id) {
          socket.emit("leave_channel", {
            channelId: selectedChannel._id,
            userId,
          });
        }

        // Join the new channel
        socket.emit("join_channel", { channelId: selectedChannel._id, userId });
      }

      // Error handling
      const errorListener = (errorMessage) => {
        console.error("Error:", errorMessage);
        alert(`Error: ${errorMessage}`);
      };

      // Message history listener
      const messageHistoryListener = (data) => {
        console.log("Message history received:", data);
        setMessages(data.reverse());
      };

      // New message listener
      const messageListener = (data) => {
        console.log("Message received:", data);
        setMessages((prev) => {
          if (userId === data.senderId) {
            return prev; // Ignore messages sent by the same user
          }
          return [...prev, data];
        });
      };

      // Typing indicator listeners
      const typingListener = ({ userId, name }) => {
        setTypingUsers((prev) => [...prev, { userId, name }]);
        console.log(
          "typing indecator trigger form the dm......................................xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        );
      };

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

        // Remove listeners to avoid memory leaks
        socket.off("private_message_history");
        socket.off("send_dm", dmMessegeListener);
        socket.off("recived_dm");
        socket.off("error", errorListener);
        socket.off("message_history", messageHistoryListener);
        socket.off("receive_message", messageListener);
        socket.off("typing", typingListener);
        socket.off("stop_typing", stopTypingListener);
      };
    }
  }, [socket, selectedChannel]);
  // Dependencies for reinitializing listeners

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

    if (selectedChannel.conversationId) {
      // Send DM
      const recipientId = selectedChannel.employeeId;
      if (!recipientId) {
        console.error("Recipient ID could not be determined.");
        return;
      }

      console.log("sender id, reciver id", userId, recipientId);

      socket.emit("send_dm", {
        senderId: userId,
        recipientId,
        content: newMessage.trim(),
      });

      console.log("dm triggered ");
    } else {
      // Send Channel Message
      socket.emit("send_message", {
        channelId: selectedChannel._id,
        content: newMessage.trim(),
        userId,
        messageType: "text",
        attachments: [],
        timestamp: new Date().toISOString(),
      });
    }

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

  const handleTyping = (e) => {
    if (socket && selectedChannel) {
      const member = JSON.parse(localStorage.getItem("member"));
      const userId = member?._id;

      console.log("typing going to trigger");

      // Emit "typing" event only if not already typing
      if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing", { channelId: selectedChannel._id, userId, conversationId });
      }

      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timeout for detecting typing stop
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false); // Reset typing status
        socket.emit("stop_typing", { channelId: selectedChannel._id, userId , conversationId });
      }, 1000); // 1 second after the last key press
    }
  };

  const handleSelectChannel = (employee) => {
    const memberId = JSON.parse(localStorage.getItem("member"))?._id;
    const conversationId = [memberId, employee._id].sort().join("_");
    setConversationId(conversationId);

    setSelectedChannel({
      name: employee.name,
      employeeId: employee._id, // Store employee ID for DMs
      conversationId, // Store conversationId for DMs
      description: "Direct message",
    });
  };

  console.log("typingUsers", typingUsers);

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
                  onClick={() => handleSelectChannel(employee)}
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
              onChange={(e) => {
                setNewMessage(e.target.value); // Update message state
                handleTyping(e); // Trigger typing event on every input change
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
