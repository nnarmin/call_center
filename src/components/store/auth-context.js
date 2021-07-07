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

const calculateRemainingTime = (expirationTime) => {
    const current_time = new Date().getTime();
    const expiration_Time = new Date(expirationTime).getTime();

    return expiration_Time-current_time;
};

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
                return;
            }
        })
    }, [isAdmin])

   /* useEffect(()=>{
        if(new Date().getTime >= decoded_token?.exp){
            logoutHandler();
        }else{
            console.log("New Date", new Date().getTime, "token exp", decoded_token?.exp)
        }
    }, []);*/

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem("jwt_token", token);
        window.location.href = '/';
        setDecodedToken(jwt_decode(token));
/*
        const remainingTime=calculateRemainingTime(expirationTime);
        setTimeout(logoutHandler, remainingTime);*/
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
