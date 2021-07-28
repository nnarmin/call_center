import React from "react";
import {Card} from "react-bootstrap";
import PurchaseItem from "./PurchaseItem";
import PurchaseNote from "./PurchaseNote";
import PurchaseStatus from "./PurchaseStatus";

const PurchaseAddEdit = () => {
    return (
        <Card>
            <Card.Body>
                <ul className="nav nav-tabs mb-3" id="ex1" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a
                            className="nav-link font-family-Roboto-Medium active"
                            data-mdb-toggle="tab"
                            href="#purchaseItem"
                            role="tab"
                            aria-controls="ex1-tabs-1"
                            aria-selected="true"
                        >Alış Məhsulu Haqqında İnformasiya</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a
                            className="nav-link font-family-Roboto-Medium"
                            data-mdb-toggle="tab"
                            href="#purchaseNote"
                            role="tab"
                            aria-controls="ex1-tabs-2"
                            aria-selected="false"
                        >Menecerin Qeydiyyatı</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a
                            className="nav-link font-family-Roboto-Medium"
                            data-mdb-toggle="tab"
                            href="#purchaseStatus"
                            role="tab"
                            aria-controls="ex1-tabs-2"
                            aria-selected="false"
                        >Sifarişin Statusu</a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane fade show active" id="purchaseItem" role="tabpanel">
                        <div className="row">
                            <div className="col-md-12">
                                <PurchaseItem/>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="purchaseNote" role="tabpanel">
                        <div className="row">
                            <div className="col-md-12">
                                <PurchaseNote/>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="purchaseStatus" role="tabpanel">
                        <div className="row">
                            <div className="col-md-12">
                                <PurchaseStatus/>
                            </div>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default PurchaseAddEdit;