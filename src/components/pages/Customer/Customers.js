import React from 'react';
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";
import Search from "../search";

const Customers = () => {
    return (
        <React.Fragment>
            <Card>
                <Card.Body className="text-center">
                    <Link to="/customer/add">
                        <Button variant="primary">Yeni Müştəri</Button>
                    </Link>
                </Card.Body>
            </Card>
            <div className="row mt-3">
                <div className="col-lg-4">
                    <Card>
                        <Card.Body>
                            <Search label="Ad üzrə axtarış" placeholder="Axtarış.."/>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-lg-4">
                    <Card>
                        <Card.Body>
                            <Search label="Ünvan üzrə axtarış" placeholder="Axtarış.."/>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-lg-4">
                    <Card>
                        <Card.Body>
                            <Search label="Nömrə üzrə axtarış" placeholder="000-xxx-xx-xx"/>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );

};

export default Customers;
