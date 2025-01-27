import { IconMessages, IconSearch } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useSocket from '../../Hooks/useSocket';

const Sidebar = ({
  search,
  setSearch,
  channels,
  selectedChannel,
  setSelectedChannel,
  employees,
  handleSelectChannelHandler,
  setChannels,
  setEmployees,
}) => {
  const socket = useSocket();
  const [userPresence, setUserPresence] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({}); // For both channels and DMs
  const [lastMessages, setLastMessages] = useState({}); // To store the last message for each conversation

  useEffect(() => {
    const fetchSearchResults = async () => {
      const member = JSON.parse(localStorage.getItem('member'));

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}api/channel/search/${
            member._id
          }`,
          {
            params: { searchQuery: search },
          },
        );
        setChannels(data.channels);
        setEmployees(data.employees);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    const debounceTimeout = setTimeout(fetchSearchResults, 300); // Debounce API call
    return () => clearTimeout(debounceTimeout);
  }, [search, setChannels, setEmployees]);

  useEffect(() => {
    if (!socket) return;

    const user = JSON.parse(localStorage.getItem('member'));

    // Fetch presence data
    socket.on('all_users_presence', (presenceData) => {
      const presenceMap = {};
      presenceData.forEach((user) => {
        presenceMap[user.userId] = user.status;
      });
      setUserPresence(presenceMap);
    });

    // Modified unread counts handler
    socket.on('unread_counts', (data) => {
      if (data.channels && data.directMessages) {
        // Handle initial load of all unread counts
        const newUnreadCounts = {};
        const newLastMessages = {};

        // Process channel unread counts
        data.channels.forEach((channel) => {
          newUnreadCounts[channel.channelId] = channel.count;
          newLastMessages[channel.channelId] = {
            message: channel.lastMessage,
            time: channel.lastMessageTime,
          };
        });

        // Process DM unread counts
        data.directMessages.forEach((dm) => {
          newUnreadCounts[dm.conversationId] = dm.count;
          newLastMessages[dm.conversationId] = {
            message: dm.lastMessage,
            time: dm.lastMessageTime,
          };
        });
      } else if (data.conversationId) {
        // If it's a single message update
        const { conversationId, count, lastMessage, lastMessageTime } = data;
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [conversationId]: count,
        }));
        setLastMessages((prevMessages) => ({
          ...prevMessages,
          [conversationId]: { message: lastMessage, time: lastMessageTime },
        }));
      }
    });

    return () => {
      socket.off('all_users_presence');
      socket.off('unread_counts');
    };
  }, [socket]);

  const handleChannelClick = (employee) => {
    const member = JSON.parse(localStorage.getItem('member'));
    const conversationId = [member._id, employee._id].sort().join('_');

    // Reset unread count for the selected channel locally
    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [conversationId]: 0,
    }));

    // Emit the 'message_read' event to the server to reset the unread count
    socket.emit('message_read', {
      userId: member._id,
      conversationId,
    });

    // Call the handler for selecting a channel
    handleSelectChannelHandler(employee);
  };

  console.log('unread', unreadCounts);

  const handleChannelSelect = (channel) => {
    const member = JSON.parse(localStorage.getItem('member'));

    // Reset unread count for the selected channel locally
    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [channel._id]: 0,
    }));

    // Emit the 'message_read' event to the server
    socket.emit('message_read', {
      userId: member._id,
      channelId: channel._id,
    });

    // Update selected channel
    setSelectedChannel(channel);
  };

  return (
    <div className='flex flex-col gap-2 w-1/4 max-h-[100vh]'>
      {/* Header */}
      <div className='sticky top-0 z-10 bg-background px-4 pb-3 shadow-md'>
        <div className='flex items-center justify-between py-2'>
          <div className='flex gap-2'>
            <h1 className='text-2xl font-bold'>Channels</h1>
            <IconMessages size={20} />
          </div>
        </div>

        {/* Search Input */}
        <label className='flex h-12 w-full items-center rounded-md border px-2'>
          <IconSearch size={15} className='mr-2 stroke-slate-500' />
          <input
            type='text'
            className='w-full bg-inherit text-sm'
            placeholder='Search chat...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* Updated Channels Section */}
      <div className='flex flex-col gap-2 flex-1'>
        <h2 className='text-lg font-semibold px-4 mb-3'>Joined Channels</h2>
        <div className='flex-1 overflow-auto border-b border-gray-700'>
          <div className='flex flex-col gap-2 px-4 overflow-y-auto'>
            {channels.map((channel) => {
              const unreadCount = unreadCounts[channel._id] || 0;
              const lastMessage = lastMessages[channel._id]?.message;
              const lastMessageTime = lastMessages[channel._id]?.time;

              return (
                <button
                  key={channel._id}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedChannel?._id === channel._id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => handleChannelSelect(channel)}
                >
                  <div className='flex items-start justify-between w-full'>
                    <div className='flex flex-col flex-grow'>
                      <span className='font-medium text-sm'>
                        # {channel.name}
                      </span>
                      {lastMessage && (
                        <span className='text-xs text-gray-400 truncate max-w-[180px]'>
                          {lastMessage}
                        </span>
                      )}
                    </div>
                    <div className='flex flex-col items-end ml-2'>
                      {lastMessageTime && (
                        <span className='text-xs text-gray-400'>
                          {new Date(lastMessageTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                      {unreadCount > 0 && (
                        <span className='bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mt-1'>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className='flex-1 overflow-auto'>
          <h2 className='text-lg font-semibold px-4 mb-3'>Direct Messages</h2>
          <div className='flex flex-col gap-2 overflow-y-auto'>
            {employees.map((employee) => {
              const member = JSON.parse(localStorage.getItem('member'));
              const conversationId = [member._id, employee._id]
                .sort()
                .join('_');
              const unreadCount = unreadCounts[conversationId] || 0;
              const isOnline = userPresence[employee._id] === 'online';
              const lastMessage = lastMessages[conversationId]?.message;
              const lastMessageTime = lastMessages[conversationId]?.time;

              return (
                <button
                  key={conversationId} // Use conversationId as key to ensure uniqueness
                  className={`flex items-center justify-between gap-3 px-3 py-1.5 rounded-md transition-colors ${
                    selectedChannel?.conversationId === conversationId
                      ? 'text-white border border-white rounded '
                      : 'text-gray-300 hover:bg-muted hover:bg-slate-700 '
                  }`}
                  onClick={() => handleChannelClick(employee)}
                >
                  <div className='flex items-start gap-3 w-full'>
                    <div className='relative'>
                      {/* Profile Image */}
                      <img
                        src={employee.dp}
                        alt={employee.name}
                        className='h-8 w-8 rounded-full object-cover'
                      />
                      {/* Online/Offline Icon */}
                      <span
                        className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 ${
                          isOnline ? 'bg-green-600' : 'bg-gray-400'
                        } border-black`}
                        title={isOnline ? 'Online' : 'Offline'}
                      ></span>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <span className='text-base font-medium'>
                        {employee.name.trim(' ')}
                      </span>
                      <span className='text-sm text-gray-500'>
                        {lastMessage}
                      </span>
                    </div>
                    <div className='flex flex-col items-end gap-1 ml-auto'>
                      <span className='text-xs text-gray-400'>
                        {lastMessageTime
                          ? new Date(lastMessageTime).toLocaleTimeString()
                          : ''}
                      </span>
                      {unreadCount > 0 && (
                        <span className='bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
