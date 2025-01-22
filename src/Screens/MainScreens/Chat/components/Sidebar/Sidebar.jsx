/* eslint-disable react/prop-types */
// components/Sidebar/Sidebar.js
import { Button } from "@antopolis/admin-component-library/dist/input-otp-BqpTxPZb";
import { IconMessages, IconSearch } from "@tabler/icons-react";
import axios from "axios";
import { useEffect } from "react";

const Sidebar = ({ search, setSearch, channels, selectedChannel, setSelectedChannel, employees, handleSelectChannelHandler, setChannels, setEmployees }) => {
  console.log("search", search);

  useEffect(() => {
    const fetchSearchResults = async () => {
   
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}api/channel/search`, {
          params: { searchQuery: search },
        });
        setChannels(data.channels);
        setEmployees(data.employees);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    const debounceTimeout = setTimeout(fetchSearchResults, 300); // Debounce API call
    return () => clearTimeout(debounceTimeout);
  }, [search, setChannels, setEmployees]);

  return (
    <div className="flex flex-col gap-2 w-1/4 max-h-[100vh]">
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

      <div className="flex flex-col gap-2 flex-1">
        <div className="flex-1 overflow-auto border-b">
          <h2 className="text-lg font-semibold px-4 mb-3">Joined Channels</h2>
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

        <div className="flex-1 overflow-auto">
          <h2 className="text-lg font-semibold px-4 mb-3">Direct Messages</h2>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {employees.map((employee) => (
              <Button
                key={employee._id}
                className={`w-full text-left p-2 ${
                  selectedChannel?.conversationId ===
                  [
                    JSON.parse(localStorage.getItem("member"))?._id,
                    employee._id,
                  ]
                    .sort()
                    .join("_")
                    ? "bg-primary text-black"
                    : "bg-secondary text-muted-foreground"
                }`}
                onClick={() => handleSelectChannelHandler(employee)}
              >
                {employee.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
