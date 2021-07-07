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
                <div className="col-lg-12">
                    <Card>
                        <Card.Body>
                            <ul className="nav nav-tabs mb-3" id="ex1" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link active"
                                        data-mdb-toggle="tab"
                                        href="#search_by_name"
                                        role="tab"
                                        aria-controls="ex1-tabs-1"
                                        aria-selected="true"
                                    >Ad üzrə axtarış</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        data-mdb-toggle="tab"
                                        href="#search_by_phone"
                                        role="tab"
                                        aria-controls="ex1-tabs-2"
                                        aria-selected="false"
                                    >Nömrə üzrə axtarış</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        data-mdb-toggle="tab"
                                        href="#search_by_address"
                                        role="tab"
                                        aria-controls="ex1-tabs-3"
                                        aria-selected="false"
                                    >Ünvan üzrə axtarış</a>
                                </li>
                            </ul>
                            <div className="tab-content" id="ex1-content">
                                <div
                                    className="tab-pane fade show active"
                                    id="search_by_name"
                                    role="tabpanel"
                                    aria-labelledby="ex1-tab-1"
                                >
                                    <Search label="Ad üzrə axtarış" placeholder="Axtarış.." search_url="/customers/search?name.contains"/>
                                </div>
                                <div className="tab-pane fade" id="search_by_phone" role="tabpanel"
                                     aria-labelledby="ex1-tab-2">
                                    <Search label="Nömrə üzrə axtarış" placeholder="Axtarış.." search_url="/customer-contacts/search?contact.contains"/>
                                </div>
                                <div className="tab-pane fade" id="search_by_address" role="tabpanel"
                                     aria-labelledby="ex1-tab-3">
                                    <Search label="Ünvan üzrə axtarış" placeholder="Axtarış.." search_url="/customer-addresses/search?address.contains"/>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                </div>
                {/*<div className="col-lg-4">
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
                </div>*/}
            </div>
        </React.Fragment>
    );

};

export default Customers;
