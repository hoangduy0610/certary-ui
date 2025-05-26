import { message } from 'antd';
import axios from 'axios';
import { StorageKeys } from '../common/StorageKeys';

const MainApiRequest = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

MainApiRequest.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(StorageKeys.AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

MainApiRequest.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (!error.request.responseURL.includes('/auth/')) {
                window.location.href = '/login';
            }
        } else {
            // Show error message using antd message
            message.error(error.response.data.message || error.message);
        }
        return Promise.reject(error);
    },
);

export default MainApiRequest;