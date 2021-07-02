import React from 'react';
import PaymentList from "./PaymentTypeList";
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";

const PaymentType = () => {
    return (
        <div className="row">
            <div className="col-lg-12 mr-auto ml-auto">
                <Card>
                    <Card.Body>
                        <Link to="/paymentMethod/add" className="d-flex justify-content-end mb-3">
                            <Button variant="primary"> Yeni Ödəniş üsulu </Button>
                        </Link>
                        <PaymentList/>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );

};

export default PaymentType;
