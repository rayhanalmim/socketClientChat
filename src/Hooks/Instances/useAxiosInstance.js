import { AuthContext } from '@/Context/AuthContext';
import axios from 'axios';
import { useContext, useMemo } from 'react';

export function useAxiosInstance() {
    const { employee, logout } = useContext(AuthContext);
    const axiosInstance = useMemo(
        () =>
            axios.create({
                baseURL:
                    import.meta.env.VITE_APP_BACKEND_URL +
                    import.meta.env.VITE_APP_AXIOS_INSTANCE_ROUTE,
                headers: {
                    Authorization: 'Bearer ' + employee?.token,
                },
            }),
        [employee],
    );

    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        (err) => {
            if (employee?.token && err?.response?.status === 401) {
                logout();
            }
            return Promise.reject(err);
        },
    );

    return axiosInstance;
}
