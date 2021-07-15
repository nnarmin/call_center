import React, {useEffect, useState} from 'react';
import Select from "react-select";
import {Button} from "react-bootstrap";
import {selectStyles} from "../../helpers/selectStyles";
import {get} from "../../api/Api";
import {useQuery} from "../../hooks/useQuery";
import {NoOptionsMessage} from "../../helpers/NoOptionsMessage";
import Loader from "react-loader-spinner";

const PurchaseItem = () => {
    const query = useQuery();
    const customer_id = query.get("id");
    const purchase_id = query.get("purchase_id");

    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentTypeList, setPaymentTypeList] = useState([]);
    const [purchaseItem, setPurchaseItem] = useState([
        {
            "purchase": {
                "id": purchase_id
            },
            "item": "",
            "paymentType": {
                "id": ''
            },
            "price": '',
            "qty": ''
        },
    ])

    useEffect(() => {
        get('/payment-types').then((res) => {
            setIsFetchingData(false);
            setPaymentTypeList(res?.content?.map((paymentType) => ({
                value: paymentType.id,
                label: `${paymentType.name}`,
            })));
        }).catch((err) => {
            setIsFetchingData(false);
        })
    }, []);

    const addNewPurchaseItem = () => {
        setPurchaseItem((prevState) => ([
            ...prevState,
            {
                "purchase": {
                    "id": purchase_id
                },
                "item": "",
                "paymentType": {
                    "id": ''
                },
                "price": '',
                "qty": ''
            }
        ]))
    }

    const handleInputChange = (i) => {
        let alldata = [...purchaseItem];
        alldata[i] = {
            "purchase": {
                "id": purchase_id
            },
            "item": "",
            "paymentType": {
                "id": ''
            },
            "price": '',
            "qty": ''
        }
        setPurchaseItem((prevState) => (
            {
                ...prevState,
                alldata
            }
        ));
    }

    const handlePurchaseItemForm = (event) => {
        event.preventDefault();
        setIsLoading(true);
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
        <form onSubmit={handlePurchaseItemForm}>
            {purchaseItem.length && purchaseItem.map((item, i) => (
                <div className="row mb-3" key={i}>
                    <div className="col-lg-4">
                        <label>Məhsulun adı</label>
                        <input type="text" className="form-control" required/>
                    </div>
                    <div className="col-lg-4">
                        <label>Ödəniş növü</label>
                        <Select
                            styles={selectStyles}
                            options={paymentTypeList}
                            components={(props) => NoOptionsMessage(props, 'Sosial Şəbəkə növü tapılmadı')}
                            onChange={handleInputChange}
                            placeholder='Sosial Şəbəkə növünü seçin...'
                        />
                    </div>
                    <div className="col-lg-2">
                        <label>Sayı</label>
                        <input type="number" className="form-control" required/>
                    </div>
                    <div className="col-lg-2">
                        <label>Qiyməti</label>
                        <input type="text" className="form-control" required/>
                    </div>
                </div>
            ))}
            <div className="d-flex justify-content-end align-items-center mt-3">
                <Button type="button"
                        variant="success"
                        className="mr-2"
                        onClick={addNewPurchaseItem}
                >
                    Yeni sifariş əlavə edin
                </Button>
                <Button type="submit"
                        variant="primary"
                        disabled={isLoading}
                >{isLoading ? 'Gözləyin…' : 'Əlavə et'}</Button>
            </div>
        </form>
    )
}

export default PurchaseItem;