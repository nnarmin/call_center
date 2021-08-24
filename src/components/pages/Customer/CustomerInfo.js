import React, {useEffect, useState} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {get, remove} from "../../api/Api";
import {Card, Tabs, Tab} from "react-bootstrap";
import Loader from "react-loader-spinner";
import PurchaseList from "../Purchase/PurchaseList";
import DeleteConfirmation from "../../others/ConfirmationModal";

const CustomerInfo = () => {
    const history = useHistory();

    const params = useParams();
    const userID = params.customerID;
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [state, setState] = useState({
        name: '',
        surname: '',
        contacts: [],
        addresses: [],
        notes: []
    });

    const [type, setType] = useState('');
    const [key, setKey] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        getUserInfo(userID);
    }, [userID]);

    const showDeleteModal = (key, type, id) => {
        setType(type);
        setId(id);
        setKey(key);
        setDeleteMessage(`Məlumatı silmək istədiyinizdən əminsiniz?`);
        setDisplayConfirmationModal(true);
    };

    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

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
            }));
        }).catch((err) => {
            setIsFetchingData(false);
        })
    }

    const userDeleteHandler = (userID) => {
        remove(`customers/${userID}`).then((res) => {
            history.push('/customers');
        })
    }

    const deleteHandle = (key, type, id) => {
        let data = [...state[type]];
        remove(`customer-${type}/${id}`).then(res => {
            setIsFetchingData(false);
            data.splice(key, 1);
            setState((prevState) => (
                {
                    ...prevState,
                    [type]: data
                }
            ));
        }).catch(err => {
            setIsFetchingData(false);
        });
        setDisplayConfirmationModal(false);
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
                        </div>
                        <div className="col-md-6 text-right">
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
                    <Tabs
                        id="controlled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="purchases" title="Sifarişlər">
                            <PurchaseList user_id={userID}/>
                        </Tab>
                        <Tab eventKey="contacts" title="Əlaqə">
                            <div className="row">
                                <div className="col-md-12">
                                    <ul className="list-group">
                                        <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                            <div className="mb-0 font-family-Roboto-Medium">Əlaqə məlumatları</div>
                                            <Link to={`/customer/add?id=${userID}&type=contact`}
                                                  type="button"
                                                  className="btn btn-primary">
                                                Yeni Əlaqə
                                            </Link>
                                        </li>
                                        {state.contacts && state.contacts.map(({contact, modifiedBy, modifiedAt, id}, i) => (
                                            <li className="list-group-item" key={i}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <span>{contact}</span>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            className='mr-3 btn-xs'
                                                            to={`/customer/add?edit=true&id=${userID}&type=contact&itemID=${id}`}
                                                        >
                                                            <i className='fas fa-edit fa-sm text-success'/>
                                                        </Link>
                                                        <span className='ml-2 btn-xs delete-button'
                                                              onClick={showDeleteModal.bind(this, i, "contacts", id)}>
                                                            <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        {!state.contacts.length && <li className="list-group-item text-center">Heç bir əlaqə vasitəsi daxil edilməyib.</li>}
                                    </ul>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="addresses" title="Ünvan">
                            <div className="row">
                                <div className="col-md-12">
                                    <ul className="list-group">
                                        <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                            <div className="mb-0 font-family-Roboto-Medium">Ünvan məlumatları</div>
                                            <Link to={`/customer/add?id=${userID}&type=address`}
                                                  type="button"
                                                  className="btn btn-primary">
                                                Yeni Ünvan
                                            </Link>
                                        </li>
                                        {state.addresses && state.addresses.map(({address, id, modifiedBy, modifiedAt}, i) => (
                                            <li className="list-group-item" key={i}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span>{address}</span>
                                                    <div>
                                                        <Link
                                                            className='mr-3 btn-xs'
                                                            to={`/customer/add?edit=true&id=${userID}&type=address&itemID=${id}`}>
                                                            <i className='fas fa-edit fa-sm text-success'/>
                                                        </Link>
                                                        <span className='ml-2 btn-xs delete-button'
                                                              onClick={showDeleteModal.bind(this, i, "addresses", id)}>
                                                            <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        {!state.addresses.length && <li className="list-group-item text-center">Heç bir ünvan məlumatı daxil edilməyib.</li>}
                                    </ul>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="notes" title="Qeydlər">
                            <div className="row">
                                <div className="col-md-12">
                                    <ul className="list-group">
                                        <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                                            <div className="mb-0 font-family-Roboto-Medium">Qeydlər</div>
                                            <Link to={`/customer/add?id=${userID}&type=note`} type="button"
                                                  className="btn btn-primary">
                                                Yeni Qeyd
                                            </Link>
                                        </li>
                                        {state.notes && state.notes.map(({note, id}, i) => (
                                            <li className="list-group-item" key={i}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span>{note}</span>
                                                    <div>
                                                        <Link
                                                            className='mr-3 btn-xs'
                                                            to={`/customer/add?edit=true&id=${userID}&type=note&itemID=${id}`}
                                                        >
                                                            <i className='fas fa-edit fa-sm text-success'/>
                                                        </Link>
                                                        <span className='ml-2 btn-xs delete-button'
                                                              onClick={showDeleteModal.bind(this, i, "notes", id)}>
                                                            <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        {!state.notes.length && <li className="list-group-item text-center">Heç bir qeyd daxil edilməyib.</li>}
                                    </ul>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </Card.Body>
                <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={deleteHandle} hideModal={hideConfirmationModal} type={type} id={id} index={key} message={deleteMessage}  />
            </Card>
        </React.Fragment>
    );

};

export default CustomerInfo;
