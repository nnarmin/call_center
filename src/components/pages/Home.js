import React, {useContext} from 'react';
import AuthContext from "../store/auth-context";
import Login from "./Login";
import Customers from "./Customer/Customers";
import PurchaseSearch from "./PurchaseFilter/PurchaseSearch";

const Home = () =>  {
    const authContext= useContext(AuthContext);
    return (
        <React.Fragment>
            {authContext.isLoggedIn &&
                <>
                    <PurchaseSearch/>
                    <Customers/>
                </>
            }
            {!authContext.isLoggedIn && <Login/>}
        </React.Fragment>
    );

};

export default Home;
