import React, {useState, useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import {useQuery} from "../../hooks/useQuery";
import {get, post, put, remove} from '../../api/Api';
import {Button, Card, Tabs, Tab} from "react-bootstrap";
import Loader from "react-loader-spinner";
import {formattedDate} from "../../helpers/formattedDate";

const CustomerAddEdit = () => {
    let query = useQuery();
    const history = useHistory();
    const isEditable = query.get('edit');
    const userId = query.get('id');
    const type = query.get('type');
    const itemID = query.get('itemID');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isDIsabled, setIsDIsabled] = useState(true);
    const [formStep, setFormStep] = useState(1);
    const [activeTab, setActiveTab] = useState('userInfo');
    const [userState, setUserState] = useState({
        name: '',
        surname: '',
        contacts: [{
            "customer": {
                "id": ''
            },
            "id": "",
            "contact": "",
            "createdBy": "",
            "createdAt": "",
            "modifiedBy": "",
            "modifiedAt": "",
        }],
        addresses: [{
            "customer": {
                "id": ''
            },
            "id": "",
            "address": "",
            "createdBy": "",
            "createdAt": "",
            "modifiedBy": "",
            "modifiedAt": ""
        }],
        notes: [{
            "customer": {
                "id": ''
            },
            "id": "",
            "note": "",
            "createdBy": "",
            "createdAt": "",
            "modifiedBy": "",
            "modifiedAt": ""
        }],
        id: userId,

    })

    useEffect(() => {
        let unmounted = false;
        if(type){
            setActiveTab(type);
        }
        if (isEditable) {
            setIsFetchingData(true);
            get(`/customers/${userId}`).then(res => {
                setUserState({
                    name: res.name,
                    surname: res.surname,
                    id: res.id
                })
                if (type === "contact") {
                    getData("contacts");
                } else if (type === "address") {
                    getData("addresses");
                } else if (type === "note") {
                    getData("notes");
                }
                setIsFetchingData(false);
            }).catch(err => {
                setIsFetchingData(false);
            })
        }
        return () => {
            unmounted = true
        };
    }, [isEditable, userId, isDIsabled, type]);

    const getData = (type) => {
        setIsFetchingData(true);
        get(`/customer-${type}/${itemID}`).then((res) => {
            setUserState((prevState) => ({
                    ...prevState,
                    [type]: [res]
                }
            ));
            setIsFetchingData(false);
        }).catch(() => {
            setIsFetchingData(false);
        })
    }

    const addNewInput = (data, type) => {
        const alldata = [...userState[data], {
            "customer": {
                "id": userId || userState.id
            },
            "id": "",
            "createdBy": "",
            "createdAt": "",
            "modifiedBy": "",
            "modifiedAt": "",
            [type]: "",
        }];
        setUserState((prevState) => (
            {
                ...prevState,
                [data]: alldata
            }
        ));
    }

    const deleteHandle = (key, type, id) => {
        let data = [...userState[type]];
        data.splice(key, 1);
        setUserState((prevState) => (
            {
                ...prevState,
                [type]: data
            }
        ));
        if (isEditable && id) {
            setIsFetchingData(true);
            remove(`customer-${type}/${id}`).then(res => {
                setIsFetchingData(false);
            }).catch(err => {
                setIsFetchingData(false);
            })
        }
    }

    const handleChange = (i, inputGroup, type, event) => {
        let alldata = [...userState[inputGroup]];
        alldata[i] = {
            ...alldata[i],
            "customer": {
                "id": userState.id
            },
            [type]: event.target.value
        };
        setUserState((prevState) => (
            {
                ...prevState,
                [inputGroup]: alldata
            }
        ));
    }

    const onUpdateHandler = (id, index, type, event) => {
        if (formStep === 1 && !type) {
            if (isEditable) {
                put(`customers/${userId}`, {name: userState.name, surname: userState.surname}).then((res) => {
                    setUserState((prevState) => (
                        {
                            ...prevState,
                            name: res.name,
                            surname: res.surname,
                            id: res.id
                        }
                    ));
                    history.push(`/customerInfo/${userId}`)
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                });
            } else {
                post(`customers/`, {name: userState.name, surname: userState.surname}).then((res) => {
                    setUserState((prevState) => ({
                            ...prevState,
                            name: res.name,
                            surname: res.surname,
                            id: res.id
                        }
                    ));
                    setIsLoading(false);
                    setIsDIsabled(false);
                }).catch((err) => {
                    setIsLoading(false);
                })
            }
        } else if (type === "contact") {
            if (isEditable) {
                put(`customer-contacts/${id}`, userState.contacts[index]).then((res) => {
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                });
            } else {
                post(`customer-contacts`, userState.contacts[index]).then((res) => {
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                })
            }
        } else if (type === "address") {
            if (isEditable) {
                put(`customer-addresses/${id}`, userState.addresses[index]).then((res) => {
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                });
            } else {
                post(`customer-addresses`, userState.addresses[index]).then((res) => {
                    setFormStep(4);
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                })
            }
        } else if (type === "note") {
            if (isEditable) {
                put(`customer-notes/${id}`, userState.notes[index]).then((res) => {
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                });
            } else {
                post(`customer-notes`, userState.notes[index]).then((res) => {
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                })
            }
        }
    }

    if (isFetchingData) {
        return (
            <div className="card">
                <div className="card-body d-flex align-items-center justify-content-center">
                    <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        height={60}
                        width={60}/>
                </div>
            </div>
        )
    }

    return (
        <Card>
            <Card.Body>
                <Tabs defaultActiveKey={activeTab} id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="userInfo" title="Müştəri" disabled={type && true}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Ad</label>
                                    <input type="text" className="form-control"
                                           value={userState.name}
                                           required
                                           onChange={(event) => {
                                               setUserState((prevState) => ({
                                                   ...prevState,
                                                   name: event.target.value
                                               }))
                                           }}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Soyad</label>
                                    <input type="text" className="form-control"
                                           value={userState.surname}
                                           required
                                           onChange={(event) => {
                                               setUserState((prevState) => ({
                                                   ...prevState,
                                                   surname: event.target.value
                                               }))
                                           }}/>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to="/"
                                  className="btn btn-info"> <i className="fas fa-angle-double-left ms-1"/> Əsas
                                səhifəyə
                                qayıt
                            </Link>
                            <Button type="button"
                                    variant="primary"
                                    disabled={isLoading}
                                    onClick={onUpdateHandler}
                                    className="mt-2"
                            >
                                {isLoading ? 'Gözləyin…' : 'Əlavə et'}
                            </Button>
                        </div>
                    </Tab>
                    <Tab eventKey="contact" title="Əlaqə Məlumatları" disabled={type==="contact" ? false : isDIsabled}>
                        {userState.contacts?.length
                            ? userState.contacts.map((contactInfo, i) => (
                                <div className="row" key={i}>
                                    <div className="col-md-12 mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-1">
                                                <input type="text" className="form-control"
                                                       value={contactInfo.contact}
                                                       required
                                                       onChange={handleChange.bind(this, i, "contacts", "contact")}/>
                                            </div>
                                            <span className="ml-2 mr-2 text-danger delete-button"
                                                  onClick={deleteHandle.bind(this, i, "contacts", contactInfo.id)}>
                                                        <i className="fas fa-trash-alt fa-sm"/>
                                                    </span>
                                            <div className="cursor-pointer"
                                                onClick={onUpdateHandler.bind(this, contactInfo.id, i, "contact")}>
                                                <i className="fas fa-check-circle text-success ml-2"/>
                                            </div>
                                        </div>
                                    </div>
                                    {contactInfo.modifiedBy &&
                                    <div className="col-12 mb-2">
                                        <span className="note note-info mb-0 mt-1 note-custom-style">
                                            Sonuncu düzəliş <strong>{contactInfo.modifiedBy}</strong> tərəfindən <strong>{formattedDate(contactInfo.modifiedAt)}</strong> edilib.
                                        </span>
                                    </div>
                                    }
                                </div>
                            ))
                            : <p className="text-center">Heç bir əlaqə vasitəsi əlavə edilməyib</p>}

                        <hr/>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <Link to="/"
                                  className="btn btn-info"> <i className="fas fa-angle-double-left ms-1"/> Əsas
                                səhifəyə
                                qayıt
                            </Link>
                            {!isEditable && <div>
                                <Button type="button"
                                        variant="success"
                                        className="mr-2"
                                        onClick={addNewInput.bind(this, "contacts", "contact")}
                                >
                                    Yeni əlaqə növü əlavə edin
                                </Button>
                            </div>
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="address" title="Ünvan" disabled={type==="address" ? false : isDIsabled}>
                        {userState.addresses?.length
                            ? userState.addresses.map((addressInfo, i) => (
                                <div className="row" key={i}>
                                    <div className="col-md-12 mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-1">
                                                <input type="text" className="form-control"
                                                       value={addressInfo.address}
                                                       required
                                                       onChange={handleChange.bind(this, i, "addresses", "address")}/>
                                            </div>
                                            <span className="ml-2 mr-2 text-danger delete-button"
                                                  onClick={deleteHandle.bind(this, i, "addresses", addressInfo.id)}>
                                                        <i className="fas fa-trash-alt fa-sm"/>
                                                    </span>
                                            <div className="cursor-pointer"
                                                onClick={onUpdateHandler.bind(this, addressInfo.id, i, "address")}>
                                                <i className="fas fa-check-circle text-success ml-2"/>
                                            </div>
                                        </div>
                                    </div>
                                    {addressInfo.modifiedBy &&
                                    <div className="col-12 mb-2">
                                        <span className="note note-info mb-0 mt-1 note-custom-style">
                                            Sonuncu düzəliş <strong>{addressInfo.modifiedBy}</strong> tərəfindən <strong>{formattedDate(addressInfo.modifiedAt)}</strong> edilib.
                                        </span>
                                    </div>
                                    }
                                </div>
                            ))
                            : <p className="text-center">Heç bir ünvan daxil edilməyib.</p>}

                        <hr/>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <Link to="/"
                                  className="btn btn-info"> <i className="fas fa-angle-double-left ms-1"/> Əsas
                                səhifəyə
                                qayıt
                            </Link>
                            {!isEditable && <div>
                                <Button type="button"
                                        variant="success"
                                        className="mt-2 mr-2"
                                        onClick={addNewInput.bind(this, "addresses", "address")}
                                >
                                    Yeni ünvan əlavə edin
                                </Button>
                            </div>
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="note" title="Qeydlər" disabled={type==="note" ? false : isDIsabled}>
                        {userState.notes?.length
                            ? userState.notes.map((noteInfo, i) => (
                                <div className="row" key={i}>
                                    <div className="col-md-12 mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-1">
                                                <input type="text" className="form-control"
                                                       value={noteInfo.note}
                                                       required
                                                       onChange={handleChange.bind(this, i, "notes", "note")}/>
                                            </div>
                                            <span className="ml-2 mr-2 text-danger delete-button"
                                                  onClick={deleteHandle.bind(this, i, "notes", noteInfo.id)}>
                                                    <i className="fas fa-trash-alt fa-sm"/>
                                                </span>
                                            <div className="cursor-pointer"
                                                onClick={onUpdateHandler.bind(this, noteInfo.id, i, "note")}>
                                                <i className="fas fa-check-circle text-success"/>
                                            </div>
                                        </div>
                                    </div>
                                    {noteInfo.modifiedBy &&
                                    <div className="col-12 mb-2">
                                        <span className="note note-info mb-0 mt-1 note-custom-style">
                                            Sonuncu düzəliş <strong>{noteInfo.modifiedBy}</strong> tərəfindən <strong>{formattedDate(noteInfo.modifiedAt)}</strong> edilib.
                                        </span>
                                    </div>
                                    }
                                </div>
                            ))
                            : <p className="text-center">Heç bir qeyd əlavə edilməyib.</p>}
                        <hr/>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <Link to="/"
                                  className="btn btn-info"> <i className="fas fa-angle-double-left ms-1"/> Əsas səhifəyə
                                qayıt
                            </Link>
                            {!isEditable && <div>
                                <Button type="button"
                                        variant="success"
                                        className="mt-2 mr-2"
                                        onClick={addNewInput.bind(this, "notes", "note")}
                                >
                                    Yeni ünvan əlavə edin
                                </Button>
                            </div>
                            }
                        </div>

                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    )
}

export default CustomerAddEdit;

