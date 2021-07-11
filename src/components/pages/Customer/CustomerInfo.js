import React, {useEffect, useState} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {get, remove} from "../../api/Api";
import {Card} from "react-bootstrap";

const CustomerInfo = () => {

    const history = useHistory();

    const params = useParams();
    const userID = params.customerID;
    const [state, setState] = useState({
        name: '',
        surname: '',
        contacts: [],
        addresses: [],
        notes: []
    })

    useEffect(() => {
        getUserInfo(userID)
    }, []);

    const getUserInfo = (userID) => {
        get(`/customers/${userID}/full`).then((res) => {
            console.log(res)
            setState(() => ({
                name: res.name,
                surname: res.surname,
                contacts: res.contacts,
                addresses: res.addresses,
                notes: res.notes
            }))
        }).catch((err) => {
            console.log(err);
        })
    }

    const userDeleteHandler = (userID) => {
        remove(`customers/${userID}`).then((res) => {
            history.push('/customers');
        })
    }

    return (
        <React.Fragment>
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">{state.name} {state.surname}</h4>
                        <button type="button" onClick={userDeleteHandler.bind(this, userID)} className="btn btn-danger btn-floating">
                            <i className="fas fa-trash-alt"/>
                        </button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                    <div className="mb-0 font-family-Roboto-Medium">Əlaqə məlumatları</div>
                                    <Link to="/customer/add?edit=true&type=contact" type="button" className="btn btn-success btn-floating">
                                        <i className="fas fa-pen"/>
                                    </Link>
                                </li>
                                {state.contacts && state.contacts.map(({contact}, i) => (
                                    <li className="list-group-item">{contact}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-md-12 mb-3">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                    <div className="mb-0 font-family-Roboto-Medium">Ünvan məlumatları</div>
                                    <Link to="/customer/add?edit=true&type=address" type="button" className="btn btn-success btn-floating">
                                        <i className="fas fa-pen"/>
                                    </Link>
                                </li>
                                {state.addresses && state.addresses.map(({address}, i) => (
                                    <li className="list-group-item">{address}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-md-12 mb-3">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                    <div className="mb-0 font-family-Roboto-Medium">Qeydlər</div>
                                    <Link to="/customer/add?edit=true&type=note" type="button" className="btn btn-success btn-floating">
                                        <i className="fas fa-pen"/>
                                    </Link>
                                </li>
                                {state.notes && state.notes.map(({note}, i) => (
                                    <li className="list-group-item">{note}</li>
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
