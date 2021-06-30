import React, {useContext} from 'react';
import AuthContext from "../store/auth-context";

const Customers = () =>  {
    const authContext= useContext(AuthContext);
    console.log(authContext);
    return (
        <React.Fragment>
            <h1>Customers</h1>
        </React.Fragment>
    );

};

export default Customers;
