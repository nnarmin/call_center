import React, {useContext} from 'react';
import AuthContext from "../store/auth-context";
import Login from "./Login";
import Customers from "./Customers";

const Home = () =>  {
    const authContext= useContext(AuthContext);
    return (
        <React.Fragment>
            {authContext.isLoggedIn && <Customers/>}
            {!authContext.isLoggedIn && <Login/>}
        </React.Fragment>
    );

};

export default Home;
