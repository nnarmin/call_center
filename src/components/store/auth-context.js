import React, {useState, useEffect} from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {},
    decoded_token : [],
    isAdmin: false
});

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(!!localStorage.getItem('jwt_token'));
    const token_decoded =localStorage.getItem('jwt_token') && jwt_decode(localStorage.getItem('jwt_token'));
    const [decoded_token, setDecodedToken] = useState(token_decoded);
    const [isAdmin, setIsAdmin] = useState(false);
    const isLoggedIn = !!token;

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem("jwt_token");
        window.location.href = '/login';
    };

    useEffect(() => {
        token_decoded && token_decoded.auth.map((auth) => {
            if(auth.authority === "ROLE_ADMIN"){
                setIsAdmin(true);
            }
        })
    }, [token_decoded]);

    const loginHandler = (token) => {
        setToken(token);
        localStorage.setItem("jwt_token", token);
        window.location.href = '/';
        setDecodedToken(jwt_decode(token));
    };

    const contextValue = {
        token: token,
        isLoggedIn: isLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
        decoded_token: decoded_token,
        isAdmin: isAdmin
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
};

export default AuthContext;
