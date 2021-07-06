import React, {useState, useEffect} from 'react';
import {get, post, put} from '../../api/Api';
import {useQuery} from '../../hooks/useQuery';
import {Button} from "react-bootstrap";

import Loader from "react-loader-spinner";

const StatusAddEdit = () => {
    let query = useQuery();

    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const isEditable = query.get("edit");
    const socialId = query.get("id");

    useEffect(() => {
        if (isEditable) {
            setIsFetchingData(true);
            get(`status-types/${socialId}`).then((res) => {
                setIsFetchingData(false);
                setName(res.name)
            }).catch((err) => {
                setIsFetchingData(false);
            })
        }
    }, [isEditable, socialId]);

    const onChangeInput = (event) => {
        setName(event.target.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setIsLoading(true);

        if(isEditable){
            put(`/status-types/${socialId}`, {name: name}).then((res) => {
                setIsLoading(false);
            }).catch((error) => {
                setIsLoading(false);
            });
        }else{
            post('/status-types', {name: name}).then((res) => {
                setIsLoading(false);
                setName('');
            }).catch((error) => {
                setIsLoading(false);
            });
        }

    };

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
                            <label>Yeni Status</label>
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

export default StatusAddEdit;
