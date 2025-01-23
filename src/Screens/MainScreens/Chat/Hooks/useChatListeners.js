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
      // New message listener
      const dmMessegeListener = (data) => {
        setMessages((prev) => {
          if (userId === data.senderId) {
            return prev; // Ignore messages sent by the same user
          }
          return [...prev, data];
        });
      };

      if (selectedChannel.conversationId) {
        // Direct Message logic

        // Leave the previous channel
        if (selectedChannel._id) {
          socket.emit('leave_channel', {
            channelId: selectedChannel._id,
            userId,
          });
        }

        socket.emit('join_dm', {
          conversationId: selectedChannel.conversationId,
        });

        socket.on('private_message_history', (data) => {
          setMessages(data.reverse());
        });

        socket.on('recived_dm', dmMessegeListener);
      } else {
        // Leave the previous channel
        if (selectedChannel._id) {
          socket.emit('leave_channel', {
            channelId: selectedChannel._id,
            userId,
          });
        }

        // Join the new channel
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
      const typingListener = ({ userId, name }) => {
        setTypingUsers((prev) => [...prev, { userId, name }]);
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
        socket.off('send_dm', dmMessegeListener);
        socket.off('recived_dm');
        socket.off('error', errorListener);
        socket.off('message_history', messageHistoryListener);
        socket.off('receive_message', messageListener);
        socket.off('typing', typingListener);
        socket.off('stop_typing', stopTypingListener);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedChannel]);
};

export default useChatListeners;
