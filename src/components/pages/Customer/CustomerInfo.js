import React, {useEffect, useState} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {get, remove} from "../../api/Api";
import {Card} from "react-bootstrap";
import Loader from "react-loader-spinner";
import AddPurchase from "../Purchase/AddPurchase";
import PurchaseItem from "../Purchase/PurchaseItem";
import PurchaseNote from "../Purchase/PurchaseNote";
import PurchaseList from "../Purchase/purchaseList";

const CustomerInfo = () => {
    const history = useHistory();

    const params = useParams();
    const userID = params.customerID;
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [state, setState] = useState({
        name: '',
        surname: '',
        contacts: [],
        addresses: [],
        notes: []
    });


    useEffect(() => {
        getUserInfo(userID);
    }, []);

    const getUserInfo = (userID) => {
        setIsFetchingData(true);
        get(`/customers/${userID}/full`).then((res) => {
            setIsFetchingData(false);
            setState(() => ({
                name: res.name,
                surname: res.surname,
                contacts: res.contacts,
                addresses: res.addresses,
                notes: res.notes,
                id: res.id
            }))
        }).catch((err) => {
            setIsFetchingData(false);
        })
    }

    const userDeleteHandler = (userID) => {
        remove(`customers/${userID}`).then((res) => {
            history.push('/customers');
        })
    }

    if (isFetchingData) {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <Loader
                    type="ThreeDots"
                    color="#00BFFF"
                    height={60}
                    width={60}/>
            </div>
        )
    }

    return (
        <React.Fragment>
            <Card>
                <Card.Header>
                    <div className="row">
                        <div className="col-md-6">
                            <h4 className="mb-0">{state.name} {state.surname}</h4>
                            {!state.contacts.length && !state.notes.length && !state.addresses.length &&
                            < button type="button" onClick={userDeleteHandler.bind(this, userID)}
                                     className="btn btn-danger btn-floating">
                                <i className="fas fa-trash-alt"/>
                            </button>
                            }
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <ul className="nav nav-tabs mb-3" id="ex1" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link font-family-Roboto-Medium active"
                                data-mdb-toggle="tab"
                                href="#purchases"
                                role="tab"
                                aria-controls="ex1-tabs-1"
                                aria-selected="true"
                            >Sifarişlər</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link font-family-Roboto-Medium"
                                data-mdb-toggle="tab"
                                href="#contacts"
                                role="tab"
                                aria-controls="ex1-tabs-2"
                                aria-selected="false"
                            >Əlaqə Məlumatları</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link font-family-Roboto-Medium"
                                data-mdb-toggle="tab"
                                href="#addresses"
                                role="tab"
                                aria-controls="ex1-tabs-1"
                                aria-selected="true"
                            >Ünvan</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link font-family-Roboto-Medium"
                                data-mdb-toggle="tab"
                                href="#notes"
                                role="tab"
                                aria-controls="ex1-tabs-2"
                                aria-selected="false"
                            >Qeydlər</a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="purchases" role="tabpanel">
                            <div className="row">
                                <div className="col-md-12">
                                    <PurchaseList user_id={userID}/>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="contacts" role="tabpanel">
                            <div className="row">
                                <div className="col-md-12">
                                    <ul className="list-group">
                                        <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                            <div className="mb-0 font-family-Roboto-Medium">Əlaqə məlumatları</div>
                                            <Link to={`/customer/add?edit=true&id=${userID}&type=contact`} type="button"
                                                  className="btn btn-success btn-floating">
                                                <i className="fas fa-pen"/>
                                            </Link>
                                        </li>
                                        {state.contacts && state.contacts.map(({contact}, i) => (
                                            <li className="list-group-item" key={i}>{contact}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="addresses" role="tabpanel">
                            <div className="row">
                                <div className="col-md-12">
                                    <ul className="list-group">
                                        <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                            <div className="mb-0 font-family-Roboto-Medium">Qeydlər</div>
                                            <Link to={`/customer/add?edit=true&id=${userID}&type=note`} type="button"
                                                  className="btn btn-success btn-floating">
                                                <i className="fas fa-pen"/>
                                            </Link>
                                        </li>
                                        {state.notes && state.notes.map(({note}, i) => (
                                            <li className="list-group-item" key={i}>{note}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="notes" role="tabpanel">
                            <div className="row">
                                <div className="col-md-12">
                                    <ul className="list-group">
                                        <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                            <div className="mb-0 font-family-Roboto-Medium">Qeydlər</div>
                                            <Link to={`/customer/add?edit=true&id=${userID}&type=note`} type="button"
                                                  className="btn btn-success btn-floating">
                                                <i className="fas fa-pen"/>
                                            </Link>
                                        </li>
                                        {state.notes && state.notes.map(({note}, i) => (
                                            <li className="list-group-item" key={i}>{note}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<div className="row">
                        <div className="col-md-12 mb-3">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                    <div className="mb-0 font-family-Roboto-Medium">Sifarişlər</div>
                                    <Link to={`/customer/add?edit=true&id=${userID}&type=contact`} type="button"
                                          className="btn btn-success btn-floating">
                                        <i className="fas fa-pen"/>
                                    </Link>
                                </li>
                                {purchases.length && purchases.map((purchase, i) => (
                                    <li className="list-group-item" key={i}>{purchase.item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-md-12 mb-3">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                    <div className="mb-0 font-family-Roboto-Medium">Əlaqə məlumatları</div>
                                    <Link to={`/customer/add?edit=true&id=${userID}&type=contact`} type="button"
                                          className="btn btn-success btn-floating">
                                        <i className="fas fa-pen"/>
                                    </Link>
                                </li>
                                {state.contacts && state.contacts.map(({contact}, i) => (
                                    <li className="list-group-item" key={i}>{contact}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-md-12 mb-3">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                    <div className="mb-0 font-family-Roboto-Medium">Ünvan məlumatları</div>
                                    <Link to={`/customer/add?edit=true&id=${userID}&type=address`} type="button"
                                          className="btn btn-success btn-floating">
                                        <i className="fas fa-pen"/>
                                    </Link>
                                </li>
                                {state.addresses && state.addresses.map(({address}, i) => (
                                    <li className="list-group-item" key={i}>{address}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-md-12 mb-3">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                    <div className="mb-0 font-family-Roboto-Medium">Qeydlər</div>
                                    <Link to={`/customer/add?edit=true&id=${userID}&type=note`} type="button"
                                          className="btn btn-success btn-floating">
                                        <i className="fas fa-pen"/>
                                    </Link>
                                </li>
                                {state.notes && state.notes.map(({note}, i) => (
                                    <li className="list-group-item" key={i}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    </div>*/}
                </Card.Body>
            </Card>
        </React.Fragment>
    );

};

export default CustomerInfo;
