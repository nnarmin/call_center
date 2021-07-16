import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Select from "react-select";
import {Button} from "react-bootstrap";
import {selectStyles} from "../../helpers/selectStyles";
import {get, post} from "../../api/Api";
import {useQuery} from "../../hooks/useQuery";
import {NoOptionsMessage} from "../../helpers/NoOptionsMessage";
import Loader from "react-loader-spinner";

const PurchaseItem = () => {
    const query = useQuery();
    const history = useHistory();

    const customer_id = query.get("id");
    const purchase_id = query.get("purchaseID");
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
                label: paymentType.name,
            })));
        }).catch((err) => {
            setIsFetchingData(false);
        })
    }, []);

    const getData = () => {
        get(`/purchase-items/search?purchaseId.equals=${purchase_id}&page=0&size=20`).then((res) => {
            console.log(res);
            setIsFetchingData(false);
        }).catch(() => {
            setIsFetchingData(false);
        })
    }

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

    const handleInputChange = (i, type, value) => {
        let alldata = [...purchaseItem];
        if(type==='select_purchase_type'){
            alldata[i] = {
                ...alldata[i],
                paymentType: {
                    id: value.value
                }
            }
        }else{
            alldata[i] = {
                ...alldata[i],
                [type]: value
            }
        }
        setPurchaseItem(alldata);
    }

    const handlePurchaseItemForm = (event) => {
        event.preventDefault();
        setIsLoading(true);
        post('/purchase-items/batch', purchaseItem).then((res) => {
            setIsLoading(false);
            history.push(`/customerInfo/${customer_id}`);
        }).catch(err => {
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
        <form onSubmit={handlePurchaseItemForm}>
            {purchaseItem.length && purchaseItem.map((item, i) => (
                <div className="row mb-3" key={i}>
                    <div className="col-lg-4">
                        <label>Məhsulun adı</label>
                        <input type="text" className="form-control"
                               onChange={(e) => handleInputChange(i, 'item', e.target.value)} value={item.item}
                               required/>
                    </div>
                    <div className="col-lg-4">
                        <label>Ödəniş növü</label>
                        <Select
                            styles={selectStyles}
                            options={paymentTypeList}
                            components={(props) => NoOptionsMessage(props, 'Sosial Şəbəkə növü tapılmadı')}
                            onChange={value => handleInputChange(i, "select_purchase_type", value)}
                            placeholder='Ödəniş növünü seçin...'
                        />
                    </div>
                    <div className="col-lg-2">
                        <label>Sayı</label>
                        <input type="number" className="form-control"
                               min="1" max="20"
                               value={item.qty}
                               onChange={(e) => handleInputChange(i, 'qty', e.target.value)}
                               required/>
                    </div>
                    <div className="col-lg-2">
                        <label>Qiyməti</label>
                        <input type="text" className="form-control"
                               value={item.price}
                               onChange={(e) => handleInputChange(i, 'price', e.target.value)}
                               required/>
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