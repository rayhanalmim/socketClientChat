import { useEffect } from 'react';

const useChatListeners = ({
  socket,
  selectedChannel,
  setMessages,
  setTypingUsers,
}) => {
  useEffect(() => {
    if (socket && selectedChannel) {
      const member = JSON.parse(localStorage.getItem('member'));
      const userId = member?._id;
      socket.emit('user_online', { userId });

      const dmMessageListener = (data) => {
        setMessages((prev) => {
          if (userId === data.senderId) {
            return prev; // Ignore messages sent by the same user
          }
          return [...prev, data];
        });
      };

      // Leave the previous channel if switching to a new one
      if (selectedChannel.conversationId) {
        // If the user is switching conversations, leave the previous DM channel
        if (selectedChannel._id) {
          socket.emit('leave_dm', { conversationId: selectedChannel._id });
        }

        socket.emit('join_dm', {
          conversationId: selectedChannel.conversationId,
        });

        socket.on('private_message_history', (data) => {
          setMessages(data.reverse());
        });

        socket.on('recived_dm', dmMessageListener);
      } else {
        // Handle leaving and joining the channel (for non-DM channels)
        if (selectedChannel._id) {
          socket.emit('leave_channel', {
            channelId: selectedChannel._id,
            userId,
          });
        }

        socket.emit('join_channel', { channelId: selectedChannel._id, userId });
      }

      // Error handling
      const errorListener = (errorMessage) => {
        console.error('Error:', errorMessage);
        alert(`Error: ${errorMessage}`);
      };

      // Message history listener
      const messageHistoryListener = (data) => {
        setMessages(data.reverse());
      };

      // New message listener
      const messageListener = (data) => {
        setMessages((prev) => {
          if (userId === data.senderId) {
            return prev; // Ignore messages sent by the same user
          }
          return [...prev, data];
        });
      };

      // Typing indicator listeners
      const typingListener = ({ userId, name, conversationId, channelId }) => {
        setTypingUsers((prev) => [...prev, { userId, name, conversationId, channelId }]);
      };

      const stopTypingListener = ({ userId }) => {
        setTypingUsers((prev) => prev.filter((user) => user.userId !== userId));
      };

      // Register all listeners
      socket.on('error', errorListener);
      socket.on('message_history', messageHistoryListener);
      socket.on('receive_message', messageListener);
      socket.on('typing', typingListener);
      socket.on('stop_typing', stopTypingListener);

      return () => {
        // Remove listeners to avoid memory leaks
        socket.off('user_online');
        socket.off('private_message_history');
        socket.off('send_dm', dmMessageListener);
        socket.off('recived_dm');
        socket.off('error', errorListener);
        socket.off('message_history', messageHistoryListener);
        socket.off('receive_message', messageListener);
        socket.off('typing', typingListener);
        socket.off('stop_typing', stopTypingListener);
      };
    }
  }, [socket, selectedChannel]);
};

export default useChatListeners;
