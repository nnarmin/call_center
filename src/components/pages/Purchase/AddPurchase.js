import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {get, post} from "../../api/Api";
import Select from 'react-select';
import {Button, Card} from "react-bootstrap";
import {selectStyles} from '../../helpers/selectStyles';
import {NoOptionsMessage} from '../../helpers/NoOptionsMessage';
import Loader from "react-loader-spinner";

const AddPurchase = () => {
    const history = useHistory();
    const params = useParams();
    const userID = params.customerID;
    const [socialTypeList, setSocialTypeList] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        get('/social-types').then((res) => {
            setIsFetchingData(false);
            setSocialTypeList(res?.content?.map((socialType) => ({
                value: socialType.id,
                label: `${socialType.name}`,
            })));
        }).catch((err) => {
            setIsFetchingData(false);
        })
    }, []);

    const handleSelectChange = (event) => {
        setSelectedValue(event.value);
        setIsDisabled(false)
    }

    const handlePurchaseForm = (event) => {
        event.preventDefault();
        setIsLoading(true);
        const purchaseData = {
            "customer": {
                "id": userID
            },
            "socialType": {
                "id": selectedValue
            }
        };
        post('/purchases', purchaseData).then((res) => {
            history.push(`/purchase/add?id=${userID}&purchase_id=${res.id}`);
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(false);
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
        <Card>
            <Card.Body>
                <div className="row">
                    <div className="col-md-8 col-lg-6">
                        <form onSubmit={handlePurchaseForm}>
                            <label>Yeni Sifariş</label>
                            <div className="d-flex">
                                <Select
                                    styles={selectStyles}
                                    options={socialTypeList}
                                    components={(props) => NoOptionsMessage(props, 'Sosial Şəbəkə növü tapılmadı')}
                                    onChange={handleSelectChange}
                                    placeholder='Sosial Şəbəkə növünü seçin...'
                                />
                                <Button
                                    type="submit"
                                    variant="success"
                                    disabled={isLoading || isDisabled}
                                    className="ml-2"
                                >{isLoading ? 'Gözləyin…' : 'Əlavə et'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default AddPurchase;