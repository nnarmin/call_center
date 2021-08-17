import React from 'react';
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";
import Search from "../../others/search";

const Customers = () => {
    return (
        <React.Fragment>
            <div className="row mt-3">
                <div className="col-lg-12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Müştəri üzrə axtarış</h5>
                            <Link to="/customer/add">
                                <Button variant="primary">Yeni Müştəri</Button>
                            </Link>
                        </Card.Header>
                        <Card.Body>
                            <ul className="nav nav-tabs mb-3" id="ex1" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link font-family-Roboto-Medium active"
                                        data-mdb-toggle="tab"
                                        href="#search_by_name"
                                        role="tab"
                                        aria-controls="ex1-tabs-1"
                                        aria-selected="true"
                                    >Ad üzrə axtarış</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link font-family-Roboto-Medium"
                                        data-mdb-toggle="tab"
                                        href="#search_by_phone"
                                        role="tab"
                                        aria-controls="ex1-tabs-2"
                                        aria-selected="false"
                                    >Nömrə üzrə axtarış</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link font-family-Roboto-Medium"
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
                                    <div className="row">
                                        <div className="col-md-6 mb-2">
                                            <Search label="Ad üzrə axtarış" className="flex-1" type="name" placeholder="Axtarış.."
                                                    search_url="/customers/search?name.contains"/>
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <Search label="Soyad üzrə axtarış" className="flex-1" type="surname" placeholder="Axtarış.."
                                                    search_url="/customers/search?surname.contains"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="search_by_phone" role="tabpanel"
                                     aria-labelledby="ex1-tab-2">
                                    <Search label="Nömrə üzrə axtarış" placeholder="Axtarış.." type="contact"
                                            search_url="/customer-contacts/search?contact.contains"/>
                                </div>
                                <div className="tab-pane fade" id="search_by_address" role="tabpanel"
                                     aria-labelledby="ex1-tab-3">
                                    <Search label="Ünvan üzrə axtarış" placeholder="Axtarış.." type="address"
                                            search_url="/customer-addresses/search?address.contains"/>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );

};

export default Customers;
