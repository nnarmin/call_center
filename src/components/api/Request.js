import {makeRequest} from "./Api";

export const LoginRequest = (username, password) => {
    return makeRequest('post', '/users/auth',
        {
            username: username,
            password: password
        });
};
