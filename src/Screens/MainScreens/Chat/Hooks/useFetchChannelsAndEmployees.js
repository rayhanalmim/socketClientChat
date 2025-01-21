import { useState, useEffect } from "react";
import axios from "axios";

const useFetchChannelsAndEmployees = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    const fetchChannelsAndEmployee = async () => {
      try {
        const member = JSON.parse(localStorage.getItem("member"));
        const userId = member?._id;
        setCurrentUser(member);

        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_BACKEND_URL
          }api/channel/getDmUser/${userId}`
        );

        const responseEmployee = await axios.get(
          `${
            import.meta.env.VITE_APP_BACKEND_URL
          }api/employeeApp/getAllEmployees/${userId}`
        );
        setEmployees(responseEmployee.data);

        setChannels(response.data); // Assuming API returns an array of channels
        setSelectedChannel(response.data[0]); // Set the first channel as default
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannelsAndEmployee();
  }, []);

  return { currentUser, employees, channels, selectedChannel, setSelectedChannel };
};

export default useFetchChannelsAndEmployees;
