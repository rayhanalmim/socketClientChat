import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  IconArrowLeft,
  IconDotsVertical,
  IconEdit,
  IconMessages,
  IconPaperclip,
  IconPhone,
  IconPhotoPlus,
  IconPlus,
  IconSearch,
  IconSend,
  IconVideo,
} from "@tabler/icons-react";
import { Button } from "@antopolis/admin-component-library/dist/input-otp-BqpTxPZb";
import { cn } from "@antopolis/admin-component-library/dist/form-B8zjCsro";// Import useSocket hook
import { useSocket } from "../../../Context/SocketContext";

export default function Chat() {
  const socket = useSocket(); // Access Socket.IO instance
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const STATIC_ROOM_ID = "static-room-123"; // Static Room ID

  // Join room when component mounts
  useEffect(() => {
    if (!socket) return;

    socket.emit("join_room", STATIC_ROOM_ID);
    console.log(`Joined room: ${STATIC_ROOM_ID}`);

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      console.log("Received message: ", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message"); // Cleanup listener
    };
  }, [socket]);

  // Handle message send
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      roomId: STATIC_ROOM_ID,
      message: newMessage,
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [
      ...prev,
      { userId: "You", message: newMessage, timestamp: new Date() },
    ]); // Add own message to UI
    setNewMessage(""); // Clear input
  };

  return (
    <section className="flex h-full p-5 gap-6">
      {/* Left Sidebar */}
      <div className="flex flex-col gap-2">
        <div className="sticky top-0 z-10 bg-background px-4 pb-3 shadow-md">
          <div className="flex items-center justify-between py-2">
            <div className="flex gap-2">
              <h1 className="text-2xl font-bold">Inbox</h1>
              <IconMessages size={20} />
            </div>
            <Button size="icon" variant="ghost" className="rounded-lg">
              <IconEdit size={24} className="stroke-muted-foreground" />
            </Button>
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
      </div>

      {/* Right Chat Panel */}
      <div className="w-full flex flex-col rounded-md border bg-primary-foreground shadow-sm">
        {/* Chat Header */}
        <div className="mb-1 flex justify-between bg-secondary p-4 shadow-lg">
          <div className="flex gap-3">
            <Button size="icon" variant="ghost" className="-ml-2">
              <IconArrowLeft />
            </Button>
            <div>
              <span className="text-sm font-medium">Chat Room</span>
              <span className="block text-xs text-muted-foreground">
                Online Users
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <IconVideo size={22} className="stroke-muted-foreground" />
            </Button>
            <Button size="icon" variant="ghost">
              <IconPhone size={22} className="stroke-muted-foreground" />
            </Button>
            <Button size="icon" variant="ghost">
              <IconDotsVertical className="stroke-muted-foreground" />
            </Button>
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
