/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "@antopolis/admin-component-library/dist/input-otp-BqpTxPZb";
import { IconPaperclip, IconSend, IconEdit } from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import useSocket from "../../Hooks/useSocket";
import Reactions from "./Component/Reaction";

// Import utis and hooks
import handleFileUpload from "../ChatPanel/chatUtils/handleFileUpload";
import handleSendMessage from "../ChatPanel/chatUtils/handleSendMessage";
import handleSaveEdit from "../ChatPanel/chatUtils/handleSaveEdit";
import addReaction from "../ChatPanel/chatUtils/addReaction";
import removeReaction from "../ChatPanel/chatUtils/removeReaction";
import { useSocketEvents } from "./Hook/useSocketEvents";

const ChatPanel = ({
  selectedChannel,
  messages,
  setMessages,
  currentUser,
  typingUsers,
  messagesEndRef,
  newMessage,
  setNewMessage,
  handleTypingHandler,
}) => {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessageContent, setEditedMessageContent] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [reactionPickerVisible, setReactionPickerVisible] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const socket = useSocket();

  const member = JSON.parse(localStorage.getItem("member"));
  const userId = member?._id;

  useSocketEvents({ socket, selectedChannel, userId, setMessages });

  return (
    <div className="w-3/4 flex flex-col rounded-md border bg-primary-foreground shadow-sm">
      {/* Chat Header */}
      <div className="mb-1 flex justify-between bg-secondary p-4 shadow-lg">
        <div className="flex gap-3">
          <div>
            {/* Channel Name */}
            <span className="text-sm font-medium">{selectedChannel?.name}</span>
            {/* Channel Description */}
            <span className="block text-xs text-muted-foreground">
              {!selectedChannel?.conversationId && selectedChannel?.description}
            </span>
            {/* Presence Status */}
            {selectedChannel?.conversationId ? (
              selectedChannel?.presence?.status === "online" ? (
                <span className="block text-xs text-green-500">Active now</span>
              ) : (
                <span className="block text-xs text-muted-foreground">
                  Last seen:{" "}
                  {selectedChannel?.presence?.lastSeen
                    ? formatDistanceToNow(
                        new Date(Number(selectedChannel.presence.lastSeen)),
                        {
                          addSuffix: true,
                        }
                      )
                    : "Unavailable"}
                </span>
              )
            ) : (
              <span className="block text-xs text-muted-foreground">
                Not currently active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chat section */}
      <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-3">
        {messages
          .reduce((groupedMessages, msg, index, array) => {
            // Skip empty messages
            const hasContent = msg?.content?.trim();
            const hasAttachment = msg?.attachment;
            if (!hasContent && !hasAttachment) return groupedMessages;

            // Check if the current message is from the same sender as the previous one
            const previousMsg = array[index - 1];
            const isSameSender =
              previousMsg &&
              previousMsg.senderId === msg.senderId &&
              previousMsg.senderName === msg.senderName;

            // Create a new group if the sender changes or is the first message
            if (!isSameSender) {
              groupedMessages.push({
                senderId: msg.senderId,
                senderName: msg.senderName,
                senderImage: msg.senderImage,
                messages: [msg],
              });
            } else {
              // Add the message to the current sender's group
              groupedMessages[groupedMessages.length - 1].messages.push(msg);
            }

            return groupedMessages;
          }, [])
          .map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              {/* Sender Details */}
              <div
                className={`relative flex ${
                  group.senderId ===
                  JSON.parse(localStorage.getItem("member"))?._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {!(
                  group.senderId ===
                  JSON.parse(localStorage.getItem("member"))?._id
                ) &&
                  group.senderImage && (
                    <img
                      src={group.senderImage}
                      alt={group.senderName}
                      className="w-8 h-8 rounded-full mr-3 mt-2"
                    />
                  )}

                <div className="flex flex-col">
                  {/* Sender Name */}
                  <div
                    className={`text-sm font-semibold text-gray-500 ${
                      group.senderId ===
                      JSON.parse(localStorage.getItem("member"))?._id
                        ? "text-right"
                        : ""
                    }`}
                  >
                    {group.senderName}
                  </div>

                  <div className="space-y-2">
                    {group.messages.map((msg, msgIndex) => {
                      // Format the createdAt timestamp to display time in HH:mm format
                      const formattedTime = format(
                        new Date(msg.createdAt),
                        "hh:mm a"
                      );

                      return (
                        <div
                          key={msg._id || msgIndex}
                          className={`relative max-w-72 px-3 py-2 shadow-lg group ${
                            group.senderId ===
                            JSON.parse(localStorage.getItem("member"))?._id
                              ? "rounded-[16px_16px_0_16px] bg-secondary text-white"
                              : "rounded-[16px_16px_16px_0] bg-secondary text-gray-200"
                          }`}
                          onMouseEnter={() => setHoveredMessageId(msg._id)}
                          onMouseLeave={() => setHoveredMessageId(null)}
                        >
                          {/* Edit Mode */}
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
                                onClick={() =>
                                  handleSaveEdit(
                                    editingMessageId,
                                    editedMessageContent,
                                    socket,
                                    currentUser,
                                    selectedChannel,
                                    setEditingMessageId,
                                    setEditedMessageContent
                                  )
                                }
                                className="text-blue-500 mt-2"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            // Normal Message Display
                            msg.content && (
                              <div className="text-gray-400 break-words relative ">
                                {msg.content}
                                {msg.edited && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    (Edited)
                                  </span>
                                )}

                                {/* Seen Users Display */}
                                {msg.seenBy.length > 0 && (
                                  <div className="flex items-center mt-1 space-x-1">
                                    {msg.seenBy
                                      .slice(0, 3)
                                      .map((user, index) => (
                                        <div key={user._id}>
                                          <img
                                            src={user.dp}
                                            alt={user.name}
                                            title={user.name}
                                            className="w-5 h-5 rounded-full border border-gray-500"
                                          />
                                        </div>
                                      ))}
                                    {msg.seenBy.length > 3 && (
                                      <span className="text-xs text-gray-500">
                                        +{msg.seenBy.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          )}

                          {/* Show Edit Icon on Hover */}
                          {hoveredMessageId === msg._id &&
                            group.senderId === currentUser._id && (
                              <button
                                className="absolute top-1 -left-4 text-gray-300 hover:text-white"
                                onClick={() => {
                                  setEditingMessageId(msg._id);
                                  setEditedMessageContent(msg.content);
                                }}
                              >
                                <IconEdit size={16} />
                              </button>
                            )}

                          {/* Attachment */}
                          {msg.attachment && (
                            <div className="mt-2">
                              <img
                                src={`${import.meta.env.VITE_APP_SPACES_URL}${
                                  msg.attachment
                                }`}
                                alt="Attachment"
                                className="rounded-lg max-h-40 object-cover"
                              />
                            </div>
                          )}

                          {/* Reactions Section */}
                          <Reactions
                            msg={msg}
                            userId={userId}
                            addReaction={(messageId, emoji) =>
                              addReaction(messageId, emoji, socket, userId)
                            }
                            removeReaction={(messageId, emoji) =>
                              removeReaction(messageId, emoji, socket, userId)
                            }
                            isPickerVisible={reactionPickerVisible === msg._id}
                            onClose={() => setReactionPickerVisible(null)}
                          />

                          {/* Display Formatted Time (Top-right corner) */}
                          <div className="absolute -top-1 right-2 text-xs text-gray-500 mt-1">
                            {formattedTime}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  {group.senderId ===
                    JSON.parse(localStorage.getItem("member"))?._id &&
                    group.senderImage && (
                      <img
                        src={group.senderImage}
                        alt={group.senderName}
                        className="w-8 h-8 rounded-full ml-3 mt-3"
                      />
                    )}
                </div>
              </div>
            </div>
          ))}

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

      {/* Message Input form */}
      <form
        className="flex gap-2 p-4"
        onSubmit={(e) =>
          handleSendMessage(
            e,
            socket,
            selectedChannel,
            newMessage,
            setMessages,
            setNewMessage,
            attachment,
            setAttachment
          )
        }
      >
        <div className="flex flex-1 items-center gap-2 rounded-md border px-2 py-1">
          <div className="space-x-1">
            {/* File Input for Attachments */}
            <label
              htmlFor="attachment"
              className="cursor-pointer px-[2px] flex items-center gap-2"
            >
              <IconPaperclip size={20} />
              <input
                id="attachment"
                type="file"
                className="hidden"
                onChange={(e) => {
                  handleFileUpload(e.target.files[0], setAttachment);
                }}
              />
            </label>
          </div>

          {/* Display Selected Attachment */}
          {attachment && (
            <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-md">
              <span className="text-sm text-gray-800">{attachment.name}</span>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}

          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-inherit"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTypingHandler(e);
            }}
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
