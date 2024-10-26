import axios from "axios";

export const axiosAuthInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL + 'api/employeeApp/public/',
})