import React, {useContext} from 'react';
import AuthContext from "../../store/auth-context";
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";

const Customers = () =>  {
    const authContext= useContext(AuthContext);
    console.log(authContext);
    return (
        <React.Fragment>
            <Card>
                <Card.Body>
                    <Link to="/customer/add">
                        <Button variant="primary">Yeni Müştəri</Button>
                    </Link>
                </Card.Body>
            </Card>
        </React.Fragment>
    );

};

export default Customers;
