import React from 'react';
import SocialList from "./SocialTypeList";
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";

const SocialType = () => {
    return (
        <div className="row">
            <div className="col-lg-12 mr-auto ml-auto">
                <Card>
                    <Card.Body>
                        <Link to="/socialType/add" className="d-flex justify-content-end mb-3"><Button variant="primary"> Yeni
                            Sosial şəbəkə </Button></Link>
                        <SocialList/>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );

};

export default SocialType;
