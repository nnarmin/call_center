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
    const userId = query.get('userId');

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
                console.log(res);
            }).catch(() => {
                setIsFetchingData(false);
            })
        }
    }, [isEditable, userId]);

    const addNewInput = () => {
        const contacts = [...userState.contacts, {
            "customer": {
                "id": userState.id
            },
            "contact": ""
        }];
        setUserState((prevState) => (
            {
                ...prevState,
                contacts
            }
        ));
    }

    const deleteHandle = (key) => {
        let contacts = [...userState.contacts];
        contacts.splice(key, 1);
        setUserState((prevState) => (
            {
                ...prevState,
                contacts
            }
        ));
    }

    const handleChange = (i, id, event) => {
        let contacts = [...userState.contacts];
        contacts[i] = {
            "customer": {
                "id": id
            },
            "contact": event.target.value
        };
        setUserState((prevState) => (
            {
                ...prevState,
                contacts
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
                    history.push('/');
                }).catch((err) => {
                    setIsLoading(false);
                });
            } else {
                post(`customer-contacts/batch`, userState.contacts).then((res) => {
                    history.push('/');
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
                                        <div className="form-group">
                                            <input type="text" className="form-control"
                                                   value={contactInfo.contact}
                                                   required
                                                   onChange={handleChange.bind(this, i, userState.id)}/>
                                        </div>
                                        <span className='ml-2 btn-xs delete-button'
                                              onClick={deleteHandle.bind(this, i)}>
                                            <i className="fas fa-trash-alt fa-sm text-danger"/>
                                        </span>
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
                                    onClick={addNewInput}
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
    } else if (formStep === 2) {
        return (
            <Card>
                <Card.Header>
                    <h3>Ünvan</h3>
                </Card.Header>
                <form onSubmit={onSubmitHandler}>
                    <Card.Body>
                        <div className="row">

                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-end">
                            <Button type="button"
                                    variant="success"
                                    className="mt-2 mr-2"
                                    onClick={addNewInput}
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

