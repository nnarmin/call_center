import React, {useEffect, useState} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {get, remove} from "../../api/Api";
import {Card} from "react-bootstrap";
import Loader from "react-loader-spinner";
import AddPurchase from "../Purchase/AddPurchase";

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

    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        getUserInfo(userID);
        getCustomerPurchases(userID)
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
            console.log(err);
            setIsFetchingData(false);
        })
    }

    const getCustomerPurchases = (userID) => {
        setIsFetchingData(true);
        get(`/purchases/search?customerId.equals=${userID}&page=0&size=20`).then((res) => {
            res.content?.map(purchaseInfo => {
                console.log(purchaseInfo.id)
                get(`/purchase-items/search?purchaseId.equals=${purchaseInfo.id}&page=0&size=20`).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
            })
        }).catch((err) => {
            console.log(err);
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
                <AddPurchase/>
                <Card.Body>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                    <div className="mb-0 font-family-Roboto-Medium">Sifarişlər</div>
                                    <Link to={`/customer/add?edit=true&id=${userID}&type=contact`} type="button"
                                          className="btn btn-success btn-floating">
                                        <i className="fas fa-pen"/>
                                    </Link>
                                </li>
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
                    </div>
                </Card.Body>
            </Card>
        </React.Fragment>
    );

};

export default CustomerInfo;
