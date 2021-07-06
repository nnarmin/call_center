import React, {useState, useEffect} from 'react';
import {useQuery} from "../../hooks/useQuery";
import {get, post, put} from '../../api/Api';
import {Button, Card} from "react-bootstrap";
import Loader from "react-loader-spinner";

const CustomerAddEdit = () => {
    let query=useQuery();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [formStep, setFormStep] = useState(1);
    const [userInfo, setUserInfo] = useState({name: '', surname: ''});
    const [userContact, setUserContact] = useState([]);

    const isEditable=query.get('edit');
    const userId=query.get('userId');

    useEffect(()=>{
        if(isEditable){
            setIsFetchingData(true);
            get(`customers/${userId}`).then((res)=> {
                setIsFetchingData(false);
                console.log(res);
            }).catch(() => {
                setIsFetchingData(false);
            })
        }
    }, [isEditable, userId])

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setIsLoading(true);
        if(formStep === 1){
            if(isEditable){
                put(`customers/${userId}`, {name: userInfo.name, surname: userInfo.surname}).then((res) => {
                    setUserInfo(res);
                    setIsLoading(false);
                    setFormStep(2);
                }).catch((err) => {
                    setIsLoading(false);
                })
            }else{
                post(`customers/`,{name: userInfo.name, surname: userInfo.surname}).then((res) => {
                    setUserInfo(res);
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
                                           value={userInfo.name}
                                           required
                                           onChange={(event) => {
                                               setUserInfo((prevState) => ({
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
                                           value={userInfo.surname}
                                           required
                                           onChange={(event) => {
                                               setUserInfo((prevState) => ({
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
    }else if(formStep===2){
        return (
            <Card>
                <Card.Body>
                    <form onSubmit={onSubmitHandler}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Əlaqə vasitəsi</label>
                                    <input type="text" className="form-control"
                                           value={userInfo.name}
                                           required
                                           onChange={(event) => {
                                               setUserContact((prevState) => ({
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
                                           value={userInfo.surname}
                                           required
                                           onChange={(event) => {
                                               setUserInfo((prevState) => ({
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
    }

}

export default CustomerAddEdit;

