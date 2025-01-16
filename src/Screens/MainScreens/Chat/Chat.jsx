import { useState, useEffect } from "react";
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
import { cn } from "@antopolis/admin-component-library/dist/form-B8zjCsro"; // Import useSocket hook
import { useSocket } from "../../../Context/SocketContext";

const channels = [
  {
    _id: "6788ecc30d254c105e3b3357",
    name: "General",
    description: "The main channel for discussions and announcements.",
    isPrivate: false,
  },
  {
    _id: "6788ecc30d254c105e3b3358",
    name: "Private Discussions",
    description: "A private space for internal team discussions.",
    isPrivate: true,
  },
  {
    _id: "6788ecc30d254c105e3b3359",
    name: "Random Chat",
    description: "For random conversations and memes.",
    isPrivate: false,
  },
  {
    _id: "6788ecc30d254c105e3b335a",
    name: "Support",
    description: "A channel for users to get help and support.",
    isPrivate: false,
  },
];

export default function Chat() {
  const socket = useSocket(); // Access Socket.IO instance
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(channels[0]); // Default to first channel

  // Join the selected channel when the component mounts
  useEffect(() => {
    if (!socket || !selectedChannel) return;

    console.log(selectedChannel)

    // Join the selected channel using channelId
    socket.emit("join_channel", { channelId: selectedChannel._id });

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      console.log("Received message: ", data);
      setMessages((prev) => [...prev, data]);
    });

    // Fetch initial message history
    socket.emit("get_message_history", { channelId: selectedChannel._id }, (messages) => {
      setMessages(messages); // Populate initial messages
    });

    return () => {
      socket.off("receive_message"); // Cleanup listener
    };
  }, [socket, selectedChannel]);

  // Handle message send
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      channelId: selectedChannel._id, // Use selected channel ID
      content: newMessage,
      messageType: "text",
      attachments: [],
    };

    socket.emit("send_message", messageData); // Send message to selected channel
    setMessages((prev) => [
      ...prev,
      { userId: "You", message: newMessage, timestamp: new Date() },
    ]); // Add own message to UI
    setNewMessage(""); // Clear input
  };

  return (
    <section className="flex h-full p-5 gap-6">
      {/* Left Sidebar */}
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
              className={`w-full text-left p-2 ${selectedChannel._id === channel._id ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}
              onClick={() => setSelectedChannel(channel)}
            >
              {channel.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="w-3/4 flex flex-col rounded-md border bg-primary-foreground shadow-sm">
        {/* Chat Header */}
        <div className="mb-1 flex justify-between bg-secondary p-4 shadow-lg">
          <div className="flex gap-3">
            <Button size="icon" variant="ghost" className="-ml-2">
              <IconArrowLeft />
            </Button>
            <div>
              <span className="text-sm font-medium">{selectedChannel.name}</span>
              <span className="block text-xs text-muted-foreground">
                {selectedChannel.description}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex flex-col flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "max-w-72 px-3 py-2 shadow-lg",
                msg.userId === "You"
                  ? "self-end rounded-[16px_16px_0_16px] bg-primary/85 text-white"
                  : "self-start rounded-[16px_16px_16px_0] bg-secondary"
              )}
            >
              {msg.message}
              <span
                className="block mt-1 text-xs font-light text-muted-foreground"
              >
                {format(new Date(msg.timestamp), "h:mm a")}
              </span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
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
