import React from 'react';
import {useParams} from 'react-router-dom';

const CustomerInfo = () =>  {

    const params= useParams();

    return (
        <React.Fragment>
            <h1>CustomerInfo {params.customerID}</h1>
        </React.Fragment>
    );

};

export default CustomerInfo;
