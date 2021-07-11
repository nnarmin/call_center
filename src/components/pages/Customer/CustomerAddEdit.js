import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {useQuery} from "../../hooks/useQuery";
import {get, post, put} from '../../api/Api';
import {Button, Card} from "react-bootstrap";
import Loader from "react-loader-spinner";

const CustomerAddEdit = () => {
    let query = useQuery();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [formStep, setFormStep] = useState(1);

    const isEditable = query.get('edit');
    const userId = query.get('type');

    const [userState, setUserState] = useState({
        name: '',
        surname: '',
        contacts: [{
            "customer": {
                "id": ''
            },
            "contact": ""
        }],
        addresses: [{
            "customer": {
                "id": ''
            },
            "address": ""
        }],
        notes: [{
            "customer": {
                "id": ''
            },
            "note": ""
        }],
        id: ''
    })

    useEffect(() => {
        if (isEditable) {
            setIsFetchingData(true);
            get(`customers/${userId}`).then((res) => {
                setIsFetchingData(false);
                setUserState({
                    name: res.name,
                    surname: res.surname,
                    id: res.id,
                    contacts: res.contacts,
                    addresses: res.addresses,
                    notes: res.notes
                })
                console.log(userState);
            }).catch(() => {
                setIsFetchingData(false);
            })
        }
    }, [isEditable, userId]);

    const addNewInput = (data, type) => {
        const alldata = [...userState[data], {
            "customer": {
                "id": userState.id
            },
            [type]: ""
        }];
        setUserState((prevState) => (
            {
                ...prevState,
                [data]: alldata
            }
        ));
    }

    const deleteHandle = (key, type) => {
        let data = [...userState[type]];
        data.splice(key, 1);
        setUserState((prevState) => (
            {
                ...prevState,
                [type]: data
            }
        ));
    }

    const handleChange = (i, id, inputGroup, type, event) => {
        let alldata = [...userState[inputGroup]];
        alldata[i] = {
            "customer": {
                "id": id
            },
            [type]: event.target.value
        };
        console.log(alldata);
        setUserState((prevState) => (
            {
                ...prevState,
                [inputGroup]: alldata
            }
        ));
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setIsLoading(true);
        if (formStep === 1) {
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
                    setIsLoading(false);
                    setFormStep(2);
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
                    setFormStep(2);
                }).catch((err) => {
                    setIsLoading(false);
                })
            }
        } else if (formStep === 2) {
            console.log(userState.contacts);
            if (isEditable) {
                put(`customer-contacts/batch`, userState.contacts).then((res) => {
                    setFormStep(3);
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                });
            } else {
                post(`customer-contacts/batch`, userState.contacts).then((res) => {
                    setFormStep(3);
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                })
            }
        } else if (formStep === 3) {
            if (isEditable) {
                put(`customer-addresses/batch`, userState.addresses).then((res) => {
                    setFormStep(4);
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                });
            } else {
                console.log(userState.addresses)
                post(`customer-addresses/batch`, userState.addresses).then((res) => {
                    setFormStep(4);
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                })
            }
        } else if (formStep === 4) {
            if (isEditable) {
                put(`customer-notes/batch`, userState.notes).then((res) => {
                    history.push(`/userInfo/${userState.id}`)
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                });
            } else {
                post(`customer-notes/batch`, userState.notes).then((res) => {
                    history.push(`/customerInfo/${userState.id}`)
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

    if (formStep === 1) {
        return (
            <Card>
                <Card.Body>
                    <form onSubmit={onSubmitHandler}>
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
                        <Button type="submit"
                                variant="primary"
                                disabled={isLoading}
                                className="mt-2"
                        >
                            {isLoading ? 'Gözləyin…' : 'Əlavə et'}
                        </Button>
                    </form>
                </Card.Body>
            </Card>
        )
    } else if (formStep === 2) {
        return (
            <Card>
                <Card.Header>
                    <h3>Əlaqə vasitəsi</h3>
                </Card.Header>
                <form onSubmit={onSubmitHandler}>
                    <Card.Body>
                        <div className="row">
                            {userState.contacts?.length
                                ? userState.contacts.map((contactInfo, i) => (
                                    <div className="col-md-6" key={i}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-1">
                                                <input type="text" className="form-control"
                                                       value={contactInfo.contact}
                                                       required
                                                       onChange={handleChange.bind(this, i, userState.id, "contacts", "contact")}/>
                                            </div>
                                            <span className="ml-2 btn btn-danger btn-floating"
                                                  onClick={deleteHandle.bind(this, i, "contacts")}>
                                                <i className="fas fa-trash-alt fa-sm"/>
                                            </span>
                                        </div>
                                    </div>

                                ))
                                : ''}
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-end">
                            <Button type="button"
                                    variant="success"
                                    className="mt-2 mr-2"
                                    onClick={addNewInput.bind(this, "contacts", "contact")}
                            >
                                Yeni əlaqə növü əlavə edin
                            </Button>
                            <Button type="submit"
                                    variant="primary"
                                    disabled={isLoading}
                                    className="mt-2"
                            >
                                {isLoading ? 'Gözləyin…' : 'Əlavə et'}
                            </Button>
                        </div>
                    </Card.Footer>
                </form>

            </Card>
        )
    } else if (formStep === 3) {
        return (
            <Card>
                <Card.Header>
                    <h3>Ünvan</h3>
                </Card.Header>
                <form onSubmit={onSubmitHandler}>
                    <Card.Body>
                        <div className="row">
                            {userState.addresses?.length
                                ? userState.addresses.map((addressInfo, i) => (
                                    <div className="col-md-6" key={i}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-1">
                                                <input type="text" className="form-control"
                                                       value={addressInfo.address}
                                                       required
                                                       onChange={handleChange.bind(this, i, userState.id, "addresses", "address")}/>
                                            </div>
                                            <span className="ml-2 btn btn-danger btn-floating"
                                                  onClick={deleteHandle.bind(this, i, "addresses")}>
                                                <i className="fas fa-trash-alt fa-sm"/>
                                            </span>
                                        </div>
                                    </div>

                                ))
                                : ''}
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-end">
                            <Button type="button"
                                    variant="success"
                                    className="mt-2 mr-2"
                                    onClick={addNewInput.bind(this, "addresses", "address")}
                            >
                                Yeni ünvan əlavə edin
                            </Button>
                            <Button type="submit"
                                    variant="primary"
                                    disabled={isLoading}
                                    className="mt-2"
                            >
                                {isLoading ? 'Gözləyin…' : 'Əlavə et'}
                            </Button>
                        </div>
                    </Card.Footer>
                </form>
            </Card>
        )
    } else if (formStep === 4) {
        return (
            <Card>
                <Card.Header>
                    <h3>Qeydlər</h3>
                </Card.Header>
                <form onSubmit={onSubmitHandler}>
                    <Card.Body>
                        <div className="row">
                            {userState.notes?.length
                                ? userState.notes.map((noteInfo, i) => (
                                    <div className="col-md-6" key={i}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-1">
                                                <input type="text" className="form-control"
                                                       value={noteInfo.note}
                                                       required
                                                       onChange={handleChange.bind(this, i, userState.id, "notes", "note")}/>
                                            </div>
                                            <span className="ml-2 btn btn-danger btn-floating"
                                                  onClick={deleteHandle.bind(this, i, "notes")}>
                                                <i className="fas fa-trash-alt fa-sm"/>
                                            </span>
                                        </div>
                                    </div>

                                ))
                                : ''}
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-end">
                            <Button type="button"
                                    variant="success"
                                    className="mt-2 mr-2"
                                    onClick={addNewInput.bind(this, "notes", "note")}
                            >
                                Yeni ünvan əlavə edin
                            </Button>
                            <Button type="submit"
                                    variant="primary"
                                    disabled={isLoading}
                                    className="mt-2"
                            >
                                {isLoading ? 'Gözləyin…' : 'Əlavə et'}
                            </Button>
                        </div>
                    </Card.Footer>
                </form>
            </Card>
        )
    }

}

export default CustomerAddEdit;

