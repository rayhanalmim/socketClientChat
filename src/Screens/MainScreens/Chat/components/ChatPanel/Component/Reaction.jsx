import { IconMoodSmile } from "@tabler/icons-react";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

const Reactions = ({ msg, userId, addReaction, removeReaction }) => {
  const [reactionPickerVisible, setReactionPickerVisible] = useState(false);

  // Available reaction emojis
  const availableReactions = ["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "🎉"];

  // Group reactions by emoji
  const groupedReactions = msg.reactions
    ? msg.reactions.reduce((acc, { reaction, userId }) => {
        if (!acc[reaction]) acc[reaction] = [];
        acc[reaction].push(userId);
        return acc;
      }, {})
    : {};

  const toggleReaction = (emoji) => {
    const users = groupedReactions[emoji] || [];
    if (users.includes(userId)) {
      removeReaction(msg._id, emoji);
    } else {
      addReaction(msg._id, emoji);
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      {/* Display grouped reactions */}
      {Object.entries(groupedReactions).map(([emoji, users]) => (
        <div
          key={emoji}
          className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-600 relative"
          onClick={() => toggleReaction(emoji)}
          data-tooltip-id={`tooltip-${emoji}`}
        >
          <span>{emoji}</span>
          <span className="text-sm text-gray-300">{users.length}</span>

          {/* Tooltip for displaying user IDs */}
          <Tooltip
            id={`tooltip-${emoji}`}
            className="bg-gray-800 text-white text-sm p-2 rounded"
          >
            {users.length > 0 ? (
              users.map((user, index) => (
                <div key={index}>
                  <span>User ID: {user}</span>
                </div>
              ))
            ) : (
              <div>No reactions yet</div>
            )}
          </Tooltip>
        </div>
      ))}

      {/* Reaction Picker Button (Smiley Icon) */}
      <button
        onClick={() => setReactionPickerVisible(!reactionPickerVisible)}
        className="ml-2 text-blue-400 hover:text-blue-500"
      >
        <IconMoodSmile size={16} />
      </button>

      {/* Reaction Picker */}
      {reactionPickerVisible && (
        <div className="absolute z-50 bg-gray-700 rounded-md shadow-lg p-2 grid grid-cols-4 gap-2">
          {availableReactions.map((emoji) => (
            <button
              key={emoji}
              className="text-xl hover:bg-gray-600 p-1 rounded-md"
              onClick={() => {
                toggleReaction(emoji);
                setReactionPickerVisible(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reactions;
