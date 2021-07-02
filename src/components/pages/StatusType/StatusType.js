import React from 'react';
import StatusList from "./StatusTypeList";
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";

const StatusType = () => {
    return (
        <div className="row">
            <div className="col-lg-12 mr-auto ml-auto">
                <Card>
                    <Card.Body>
                        <Link to="/statusType/add" className="d-flex justify-content-end mb-3"><Button
                            variant="primary"> Yeni
                            Status </Button></Link>
                        <StatusList/>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );

};

export default StatusType;
