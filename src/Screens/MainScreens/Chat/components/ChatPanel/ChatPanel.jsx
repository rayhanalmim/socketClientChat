/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "@antopolis/admin-component-library/dist/input-otp-BqpTxPZb";
import { IconPaperclip, IconSend, IconEdit } from "@tabler/icons-react";
import { format } from "date-fns";
import axios from "axios";

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
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessageContent, setEditedMessageContent] = useState("");

  console.log("selected channel from chat panel:", selectedChannel);

  // Update message content function
  const updateMessage = async (messageId, newContent) => {
    try {
      const endpoint = selectedChannel._id
        ? `api/message/group/${selectedChannel._id}/message/${messageId}`
        : `api/message/dm/${selectedChannel.conversationId}/message/${messageId}`;

      const response = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}${endpoint}`,
        { content: newContent }
      );
      console.log("Message updated successfully:", response.data);

      setEditingMessageId(null); // Reset edit state
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleEditClick = (messageId, content) => {
    setEditingMessageId(messageId); // Start editing the message
    setEditedMessageContent(content); // Pre-fill the message content
  };

  const handleSaveEdit = (messageId, isGroupMessage) => {
    if (editedMessageContent.trim()) {
      updateMessage(messageId, editedMessageContent, isGroupMessage);
    }
  };

  return (
    <div className="w-3/4 flex flex-col rounded-md border bg-primary-foreground shadow-sm">
      {/* Chat Header */}
      <div className="mb-1 flex justify-between bg-secondary p-4 shadow-lg">
        <div className="flex gap-3">
          <div>
            <span className="text-sm font-medium">{selectedChannel?.name}</span>
            <span className="block text-xs text-muted-foreground">
              {selectedChannel?.description}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          if (!msg?.content.trim()) return null; // Skip empty messages

          const isSender =
            msg.senderId === JSON.parse(localStorage.getItem("member"))?._id;
          const isGroupMessage = !!selectedChannel; // Check if it's a group message

          return (
            <div
              key={index}
              className={`relative flex ${
                isSender ? "justify-end" : "justify-start"
              } mb-4`}
            >
              {/* User Image */}
              {!isSender && msg.senderImage && (
                <img
                  src={msg.senderImage}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full mr-3 mt-2"
                />
              )}

              {/* Parent Wrapper */}
              <div
                className="group relative flex items-center space-x-2"
                style={{ background: "none" }}
              >
                {/* Message Bubble */}
                <div
                  className={`relative max-w-72 px-3 py-2 shadow-lg ${
                    isSender
                      ? "rounded-[16px_16px_0_16px] bg-slate-900 text-white"
                      : "rounded-[16px_16px_16px_0] bg-slate-900 text-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-white">
                      {msg?.senderName}
                    </span>
                    <span className="text-xs font-light text-gray-400">
                      {msg?.createdAt &&
                        format(new Date(msg.createdAt), "h:mm a")}
                    </span>
                  </div>

                  {/* Editable Message Content */}
                  {editingMessageId === msg._id ? (
                    <div>
                      <textarea
                        className="w-full bg-gray-700 text-white p-2 rounded"
                        value={editedMessageContent}
                        onChange={(e) =>
                          setEditedMessageContent(e.target.value)
                        }
                      />
                      <button
                        onClick={() => handleSaveEdit(msg._id, isGroupMessage)}
                        className="text-blue-500 mt-2"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400">{msg?.content}</div>
                  )}

                  {msg.attachments?.length > 0 && (
                    <div className="mt-2">
                      {msg.attachments.map((attachment, idx) => (
                        <a
                          key={idx}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                        >
                          {attachment.name || "Attachment"}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Edit Button */}
                {isSender && !editingMessageId && (
                  <button
                    onClick={() =>
                      handleEditClick(msg._id, msg.content, isGroupMessage)
                    }
                    className="absolute hidden group-hover:block left-[-24px] top-1"
                  >
                    <IconEdit
                      size={17}
                      className="text-gray-500 hover:text-gray-300"
                    />
                  </button>
                )}
              </div>

              {/* Sender Image for Sent Messages */}
              {isSender && msg.senderImage && (
                <img
                  src={msg.senderImage}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full ml-3 mt-2"
                />
              )}
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
