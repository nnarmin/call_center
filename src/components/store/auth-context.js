import React, {useState} from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {},
    decoded_token : []
});

const calculateRemainingTime = (expirationTime) => {
    const current_time = new Date().getTime();
    const expiration_Time = new Date(expirationTime).getTime();

    return expiration_Time-current_time;
};

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(!!localStorage.getItem('jwt_token'));
    const token_decoded =localStorage.getItem('jwt_token') && jwt_decode(localStorage.getItem('jwt_token'));
    const [decoded_token, setDecodedToken] = useState(token_decoded);

    const isLoggedIn = !!token;

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem("jwt_token");
        window.location.href = '/login';
    };

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem("jwt_token", token);

        setDecodedToken(jwt_decode(token));

        const remainingTime=calculateRemainingTime(expirationTime);
        setTimeout(logoutHandler, remainingTime);
    };

    const contextValue = {
        token: token,
        isLoggedIn: isLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
        decoded_token: decoded_token
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
};

export default AuthContext;
