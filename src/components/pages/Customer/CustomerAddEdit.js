import React, {useState, useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import {useQuery} from "../../hooks/useQuery";
import {get, post, put, remove} from '../../api/Api';
import {Button, Card} from "react-bootstrap";
import Loader from "react-loader-spinner";
import {formattedDate} from "../../helpers/formattedDate";

const CustomerAddEdit = () => {
    let query = useQuery();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [formStep, setFormStep] = useState(1);

    const isEditable = query.get('edit');
    const userId = query.get('id');
    const type = query.get('type');

    const [userState, setUserState] = useState({
        name: '',
        surname: '',
        contacts: [{
            "customer": {
                "id": ''
            },
            "id": "",
            "contact": "",
            "created_by": '',
            "modified_by": '',
            "modified_date": ''
        }],
        addresses: [{
            "customer": {
                "id": ''
            },
            "id": "",
            "address": "",
            "created_by": '',
            "modified_by": '',
            "modified_date": ''
        }],
        notes: [{
            "customer": {
                "id": ''
            },
            "id": "",
            "note": "",
            "created_by": '',
            "modified_by": '',
            "modified_date": ''
        }],
        id: '',

    })

    useEffect(() => {
        let unmounted = false;
        if (isEditable) {
            setIsFetchingData(true);
            get(`/customers/${userId}`).then(res => {
                setUserState({
                    name: res.name,
                    surname: res.surname,
                    id: res.id
                })
                if (type === "contact") {
                    getData("contacts", "contact");
                } else if (type === "address") {
                    getData("addresses", "address");
                } else if (type === "note") {
                    getData("notes", "note");
                }
                setIsFetchingData(false);
            }).catch(err => {
                setIsFetchingData(false);
            })
        }
        return () => {
            unmounted = true
        };
    }, [isEditable, userId]);

    const getData = (type, fieldName) => {
        get(`/customer-${type}/search?customerId.equals=${userId}&page=0&size=20`).then((res) => {
            const dataArr = [];
            res.content.map(data => dataArr.push({
                "customer": {
                    "id": data.customer.id
                },
                [fieldName]: data[fieldName],
                "id": data.id,
                "created_by": data.createdBy,
                "modified_by": data.modifiedBy,
                "modified_date": data.modifiedAt
            }));
            setUserState((prevState) => ({
                    ...prevState,
                    [type]: dataArr
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
                "id": userState.id
            },
            "id": "",
            "created_by": '',
            "modified_by": '',
            "modified_date": '',
            [type]: ""
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

    const handleChange = (i, id, inputGroup, type, typeId, event) => {
        let alldata = [...userState[inputGroup]];
        alldata[i] = {
            "customer": {
                "id": id
            },
            "id": typeId,
            [type]: event.target.value
        };
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
        if (formStep === 1 && type === null) {
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
                    setFormStep(2);
                }).catch((err) => {
                    setIsLoading(false);
                })
            }
        } else if (formStep === 2 || type === "contact") {
            if (isEditable) {
                put(`customer-contacts/batch`, userState.contacts).then((res) => {
                    history.push(`/customerInfo/${userId}`)
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
        } else if (formStep === 3 || type === "address") {
            if (isEditable) {
                put(`customer-addresses/batch`, userState.addresses).then((res) => {
                    history.push(`/customerInfo/${userId}`)
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                });
            } else {
                post(`customer-addresses/batch`, userState.addresses).then((res) => {
                    setFormStep(4);
                    setIsLoading(false);
                }).catch((err) => {
                    setIsLoading(false);
                })
            }
        } else if (formStep === 4 || type === "note") {
            console.log(userState.notes)
            if (isEditable) {
                put(`customer-notes/batch`, userState.notes).then((res) => {
                    history.push(`/customerInfo/${userId}`)
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

    if (formStep === 1 && type === null) {
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
    } else if (formStep === 2 || type === "contact") {
        return (
            <Card>
                <Card.Header>
                    <h4>Əlaqə vasitəsi</h4>
                </Card.Header>
                <form onSubmit={onSubmitHandler}>
                    <Card.Body>
                        <div className="row">
                            {userState.contacts?.length
                                ? userState.contacts.map((contactInfo, i) => (
                                    <div className="col-md-6 mb-3" key={i}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-1">
                                                <input type="text" className="form-control"
                                                       value={contactInfo.contact}
                                                       required
                                                       onChange={handleChange.bind(this, i, userState.id, "contacts", "contact", contactInfo.id)}/>
                                            </div>
                                            <span className="ml-2 text-danger delete-button"
                                                  onClick={deleteHandle.bind(this, i, "contacts", contactInfo.id)}>
                                                <i className="fas fa-trash-alt fa-sm"/>
                                            </span>
                                        </div>
                                    </div>
                                ))
                                : ''}
                        </div>
                        {userState.contacts && userState.contacts[0]?.modified_by &&
                        <p className="note note-primary mb-0">
                            Sonuncu
                            dəyişiklik <strong>{userState.contacts[0].modified_by}</strong> tərəfindən <strong>{formattedDate(userState.contacts[0].modified_date)}</strong> tarixdə
                            edilib.
                        </p>}
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <Link to="/"
                                  className="btn btn-info"> <i className="fas fa-angle-double-left ms-1"/> Əsas
                                səhifəyə
                                qayıt
                            </Link>
                            <div>
                                <Button type="button"
                                        variant="success"
                                        className="mr-2"
                                        onClick={addNewInput.bind(this, "contacts", "contact")}
                                >
                                    Yeni əlaqə növü əlavə edin
                                </Button>
                                <Button type="submit"
                                        variant="primary"
                                        disabled={isLoading}
                                >
                                    {isLoading ? 'Gözləyin…' : 'Əlavə et'}
                                </Button>
                            </div>
                        </div>
                    </Card.Footer>
                </form>

            </Card>
        )
    } else if (formStep === 3 || type === "address") {
        return (
            <Card>
                <Card.Header>
                    <h4>Ünvan</h4>
                </Card.Header>
                <form onSubmit={onSubmitHandler}>
                    <Card.Body>
                        <div className="row">
                            {userState.addresses?.length
                                ? userState.addresses.map((addressInfo, i) => (
                                    <div className="col-md-6 mb-2" key={i}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-1">
                                                <input type="text" className="form-control"
                                                       value={addressInfo.address}
                                                       required
                                                       onChange={handleChange.bind(this, i, userState.id, "addresses", "address", addressInfo.id)}/>
                                            </div>
                                            <span className="ml-2 text-danger delete-button"
                                                  onClick={deleteHandle.bind(this, i, "addresses", addressInfo.id)}>
                                                <i className="fas fa-trash-alt fa-sm"/>
                                            </span>
                                        </div>
                                    </div>

                                ))
                                : ''}
                        </div>
                        {userState.addresses && userState.addresses[0]?.modified_by &&
                        <p className="note note-primary mb-0">
                            Sonuncu
                            dəyişiklik <strong>{userState.addresses[0] && userState.addresses[0]?.modified_by}</strong> tərəfindən <strong>{formattedDate(userState.addresses[0].modified_date)}</strong> tarixdə
                            edilib.
                        </p>
                        }
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <Link to="/"
                                  className="btn btn-info"> <i className="fas fa-angle-double-left ms-1"/> Əsas
                                səhifəyə
                                qayıt
                            </Link>
                            <div>
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
                        </div>
                    </Card.Footer>
                </form>
            </Card>
        )
    } else if (formStep === 4 || type === "note") {
        return (
            <Card>
                <Card.Header>
                    <h4>Qeydlər</h4>
                </Card.Header>
                <form onSubmit={onSubmitHandler}>
                    <Card.Body>
                        <div className="row">
                            {userState.notes?.length
                                ? userState.notes.map((noteInfo, i) => (
                                    <div className="col-md-6 mb-2" key={i}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-1">
                                                <input type="text" className="form-control"
                                                       value={noteInfo.note}
                                                       required
                                                       onChange={handleChange.bind(this, i, userState.id, "notes", "note", noteInfo.id)}/>
                                            </div>
                                            <span className="ml-2 text-danger delete-button"
                                                  onClick={deleteHandle.bind(this, i, "notes", noteInfo.id)}>
                                                <i className="fas fa-trash-alt fa-sm"/>
                                            </span>
                                        </div>
                                    </div>

                                ))
                                : ''}
                        </div>
                        {userState.notes && userState.notes[0]?.modified_by &&
                        <p className="note note-primary mb-0">
                            Sonuncu
                            dəyişiklik <strong>{userState.notes[0] && userState.notes[0].modified_by}</strong> tərəfindən <strong>{formattedDate(userState.notes[0] && userState.notes[0].modified_date)}</strong> tarixdə
                            edilib.
                        </p>
                        }
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <Link to="/"
                                  className="btn btn-info"> <i className="fas fa-angle-double-left ms-1"/> Əsas səhifəyə qayıt
                            </Link>
                            <div>
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
                        </div>
                    </Card.Footer>
                </form>
            </Card>
        )
    }

}

export default CustomerAddEdit;

