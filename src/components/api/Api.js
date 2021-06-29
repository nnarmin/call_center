import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://192.168.3.171:8081/api/v1',
    timeout: 1000,
});

export const makeRequest = (type, path, body) => instance[type](path, body)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        console.log(error);
    });

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});
