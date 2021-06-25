import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

const makeRequest = (type, path, body) => instance.type(path, body)
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });