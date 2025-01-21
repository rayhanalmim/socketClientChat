/* eslint-disable react/prop-types */
// components/ChatPanel/ChatPanel.js
import { Button } from "@antopolis/admin-component-library/dist/input-otp-BqpTxPZb";
import {
  IconArrowLeft,
  IconPlus,
  IconPhotoPlus,
  IconPaperclip,
  IconSend,
} from "@tabler/icons-react";
import { format } from "date-fns";

const ChatPanel = ({
  selectedChannel,
  messages,
  currentUser,
  typingUsers,
  messagesEndRef,
  sendMessageHandler,
  newMessage,
  setNewMessage,
  handleTypingHandler,
}) => {
  return (
    <div className="w-3/4 flex flex-col rounded-md border bg-primary-foreground shadow-sm">
      {/* Chat Header */}
      <div className="mb-1 flex justify-between bg-secondary p-4 shadow-lg">
        <div className="flex gap-3">
          <Button size="icon" variant="ghost" className="-ml-2">
            <IconArrowLeft />
          </Button>
          <div>
            <span className="text-sm font-medium">{selectedChannel?.name}</span>
            <span className="block text-xs text-muted-foreground">
              {selectedChannel?.description}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((msg, index) => {
          if (!msg?.content.trim()) return null; // Skip empty messages
          return (
            <div
              key={index}
              className={`max-w-72 px-3 py-2 shadow-lg ${
                msg.senderId === JSON.parse(localStorage.getItem("member"))?._id
                  ? "self-end rounded-[16px_16px_0_16px] bg-primary/85 text-white"
                  : "self-start rounded-[16px_16px_16px_0] bg-primary/85 text-white"
              }`}
            >
              <div className="font-semibold text-red-300">
                {msg?.senderName}
              </div>
              <div>{msg?.content}</div>
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

        {/* Typing Users */}
        <div className="my-1">
          {typingUsers.length > 0 && (
            <p className="text-gray-500 text-sm italic my-1">
              {typingUsers
                .filter((user) => user.userId !== currentUser._id)
                .map((user, index) => (
                  <span key={user.userId}>
                    {user.name} is typing
                    {index === typingUsers.length - 1 ? "..." : ","}{" "}
                  </span>
                ))}
            </p>
          )}
        </div>

        {/* Scroll Ref */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
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
              handleTypingHandler(e); // Trigger typing event on every input change
            }} // Detect typing when input is focused
          />
          <Button type="submit" size="icon" variant="ghost">
            <IconSend size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
