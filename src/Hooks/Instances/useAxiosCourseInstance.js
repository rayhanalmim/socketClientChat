import axios from "axios";

const axiosChannelInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL + 'api/channel',
});

export default axiosChannelInstance;