/* eslint-disable react/prop-types */
import { Button } from "@antopolis/admin-component-library/dist/input-otp-BqpTxPZb";
import { IconMessages, IconSearch } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import useSocket from "../../Hooks/useSocket";

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
  const [unreadCounts, setUnreadCounts] = useState({}); // Store unread counts for each employee

  useEffect(() => {
    const fetchSearchResults = async () => {
      const member = JSON.parse(localStorage.getItem("member"));
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}api/channel/search/${
            member._id
          }`,
          {
            params: { searchQuery: search },
          }
        );
        setChannels(data.channels);
        setEmployees(data.employees);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const debounceTimeout = setTimeout(fetchSearchResults, 300); // Debounce API call
    return () => clearTimeout(debounceTimeout);
  }, [search, setChannels, setEmployees]);

  useEffect(() => {
    if (!socket) return;

    // Fetch initial presence data
    socket.on("all_users_presence", (presenceData) => {
      const presenceMap = {};
      presenceData.forEach((user) => {
        presenceMap[user.userId] = user.status;
      });
      setUserPresence(presenceMap);
    });

    // Listen for presence updates
    socket.on("user_presence_updated", ({ userId, status }) => {
      setUserPresence((prevPresence) => ({
        ...prevPresence,
        [userId]: status,
      }));
    });

    // Fetch unread message count for each employee
    const member = JSON.parse(localStorage.getItem("member"));
    employees.forEach((employee) => {
      const conversationId = [member._id, employee._id].sort().join("_");
      socket.emit("fetch_unread_count", { userId: member._id, conversationId });
    });

    // Listen for unread count updates
    socket.on("unread_count", ({ conversationId, count }) => {
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [conversationId]: count,
      }));
    });

    return () => {
      socket.off("all_users_presence");
      socket.off("user_presence_updated");
      socket.off("unread_count");
    };
  }, [socket, employees]);

  const handleChannelClick = (employee) => {
    const member = JSON.parse(localStorage.getItem("member"));
    const conversationId = [member._id, employee._id].sort().join("_");

    // Reset unread count for the selected channel (marking messages as read)
    socket.emit("message_read", { userId: member._id, conversationId });

    // Immediately update the unread count on the frontend to 0
    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [conversationId]: 0,
    }));

    // Call the handler for selecting a channel
    handleSelectChannelHandler(employee);
  };

  return (
    <div className="flex flex-col gap-2 w-1/4 max-h-[100vh]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background px-4 pb-3 shadow-md">
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-2">
            <h1 className="text-2xl font-bold">Channels</h1>
            <IconMessages size={20} />
          </div>
        </div>

        {/* Search Input */}
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

      {/* Channels Section */}
      <div className="flex flex-col gap-2 flex-1">
        <h2 className="text-lg font-semibold px-4 mb-3">Joined Channels</h2>
        <div className="flex-1 overflow-auto border-b">
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

        {/* Direct Messages Section */}
        <div className="flex-1 overflow-auto">
          <h2 className="text-lg font-semibold px-4 mb-3">Direct Messages</h2>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {employees.map((employee) => {
              const member = JSON.parse(localStorage.getItem("member"));
              const conversationId = [member._id, employee._id]
                .sort()
                .join("_");
              const unreadCount = unreadCounts[conversationId] || 0;
              const isOnline = userPresence[employee._id] === "online";

              return (
                <button
                  key={employee._id}
                  className={`flex items-center justify-between gap-3 px-3 py-1.5 rounded-md transition-colors ${
                    selectedChannel?.conversationId === conversationId
                      ? "text-white border border-white rounded "
                      : "text-gray-300 hover:bg-muted hover:bg-slate-700 "
                  }`}
                  onClick={() => handleChannelClick(employee)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {/* Profile Image */}
                      <img
                        src={employee.dp}
                        alt={employee.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      {/* Online/Offline Icon */}
                      <span
                        className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 ${
                          isOnline ? "bg-green-600" : "bg-gray-400"
                        } border-black`}
                        title={isOnline ? "Online" : "Offline"}
                      ></span>
                    </div>
                    <span className="text-base font-medium">
                      {employee.name}
                    </span>
                  </div>

                  {/* Unread Count Badge */}
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
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
