import axios from 'axios';
import { store } from 'react-notifications-component';

const axiosInstance = axios.create({
    baseURL: 'http://159.89.43.254:8081/api/v1',
});

export const get = (url) => axiosInstance.get(url).then((res) => res.data);
export const post = (url, data) => axiosInstance.post(url, data).then((res) => res.data);
export const put = (url, data) => axiosInstance.put(url, data).then((res) => res.data);
export const remove = (url, data) => axiosInstance.delete(url, data).then((res) => res.data);

axiosInstance.interceptors.request.use((config) => {
    const jwt = localStorage.getItem('jwt_token');
    if (jwt) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${jwt}`,
        };
    }
    return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use((res) => {
    if ((res.status === 201 || res.status === 200) && (res.config.method === 'post' || res.config.method === 'put')) {

        store.addNotification({
            title: "Uğurlu Əməliyyat!",
            message: " ",
            type: "success",
            insert: "top",
            container: "top-left",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 1000,
                onScreen: true
            }
        });
    }
    if (res.status === 204 && res.config.method === 'delete') {
        store.addNotification({
            title: "Uğurla Silindi!",
            message: " ",
            type: "success",
            insert: "top",
            container: "top-left",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 1000,
                onScreen: true
            }
        });
    }
    return res;
}, (error) => {
    if (error?.response?.status === 403) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/login';
    }

    if (error?.response?.status) {
        store.addNotification({
            title: error?.response?.data?.message || 'Xəta baş verdi!',
            message: ' ',
            type: "danger",
            insert: "top",
            container: "top-left",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 1000,
                onScreen: true
            }
        });
    }
    return Promise.reject(error);
});

export default axiosInstance;

