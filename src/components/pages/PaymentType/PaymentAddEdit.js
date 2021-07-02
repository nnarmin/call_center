import React, {useState, useEffect} from 'react';
import {get, post, put} from '../../api/Api';
import {useQuery} from '../../hooks/useQuery';
import {Button} from "react-bootstrap";

import Loader from "react-loader-spinner";

const PaymentAddEdit = () => {
    let query = useQuery();

    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [err, setErr] = useState(false);

    const isEditable = query.get("edit");
    const paymentId = query.get("id");

    useEffect(() => {
        if (isEditable) {
            setIsFetchingData(true);
            get(`payment-types/${paymentId}`).then((res) => {
                setIsFetchingData(false);
                setName(res.name)
            }).catch((err) => {
                setIsFetchingData(false);
                setErr(true);
            })
        }
    }, [isEditable, paymentId]);

    const onChangeInput = (event) => {
        setName(event.target.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setIsLoading(true);

        if(isEditable){
            put(`/payment-types/${paymentId}`, {name: name}).then((res) => {
                setIsLoading(false);
            }).catch((error) => {
                setIsLoading(false);
            });
        }else{
            post('/payment-types', {name: name}).then((res) => {
                setIsLoading(false);
                setName('');
            }).catch((error) => {
                setIsLoading(false);
                setErr(true);
            });
        }

    };

    if(err){
        return <></>;
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

    if (!isFetchingData) {
        return (
            <div className="card">
                <div className="card-body">
                    <form onSubmit={onSubmitHandler}>
                        <div className="form-group">
                            <label>Yeni Ödəniş üsulu</label>
                            <input type="text" className="form-control"
                                   value={name}
                                   onChange={onChangeInput}
                                   required/>
                        </div>
                        <Button type="submit"
                                variant="primary"
                                disabled={isLoading}
                                className="mt-2"
                        >
                            {isLoading ? 'Gözləyin…' : 'Əlavə et'}
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
};

export default PaymentAddEdit;
