import React, {useEffect, useState} from 'react';
import Select from "react-select";
import {Button} from "react-bootstrap";
import {selectStyles} from "../../helpers/selectStyles";
import {get, post} from "../../api/Api";
import {useQuery} from "../../hooks/useQuery";
import {NoOptionsMessage} from "../../helpers/NoOptionsMessage";
import Loader from "react-loader-spinner";
import {formattedDate} from "../../helpers/formattedDate";

const PurchaseItem = () => {
    const query = useQuery();
    const purchase_id = query.get("purchase_id");
    const type = query.get("type");
    const item_id = query.get("id");
    const isEditable = query.get("edit");
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentTypeList, setPaymentTypeList] = useState([]);
    const [purchaseItem, setPurchaseItem] = useState([
        {
            "purchase": {
                "createdBy": '',
                "createdAt": '',
                "modifiedBy": '',
                "modifiedAt": '',
                "id": purchase_id
            },
            "item": "",
            "paymentType": {
                "id": '',
                'name': ''
            },
            "price": '',
            "qty": '',
            'id': ''
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
        if(isEditable && type==="info"){
            getData();
        }
    }, []);

    const getData = () => {
        get(`/purchase-items/${item_id}`).then((res) => {
            setPurchaseItem([res]);
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
        if (type === 'select_purchase_type') {
            alldata[i] = {
                ...alldata[i],
                paymentType: {
                    id: value.value,
                    name: value.label
                }
            }
        } else {
            alldata[i] = {
                ...alldata[i],
                [type]: value
            }
        }
        setPurchaseItem(alldata);
    }

    const deletePurchaseItemHandler = () => {

    }

    const onUpdateHandler = (index, event) => {
        event.preventDefault();
        setIsLoading(true);
        post('/purchase-items', purchaseItem[index]).then((res) => {
            setIsLoading(false);
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
        <div>
            <ul className="list-group">
                {purchaseItem.length && purchaseItem.map((item, i) => (
                    <li className="list-group-item" key={i}>
                        <div className="row">
                            <div className="col-lg-4">
                                <label className="mb-0 small ">Məhsulun adı</label>
                                <input type="text" className="form-control"
                                       onChange={(e) => handleInputChange(i, 'item', e.target.value)} value={item.item}
                                       required/>
                            </div>
                            <div className="col-lg-3">
                                <label className="mb-0 small ">Ödəniş növü</label>
                                <Select
                                    styles={selectStyles}
                                    options={paymentTypeList}
                                    value ={item?.paymentType ? [{ value: item?.paymentType?.id, label: item?.paymentType?.name }] : ''}
                                    components={(props) => NoOptionsMessage(props, 'Sosial Şəbəkə növü tapılmadı')}
                                    onChange={value => handleInputChange(i, "select_purchase_type", value)}
                                    placeholder='Ödəniş növünü seçin...'
                                />
                            </div>
                            <div className="col-lg-2">
                                <label className="mb-0 small ">Sayı</label>
                                <input type="number" className="form-control"
                                       min="1" max="20"
                                       value={item.qty}
                                       onChange={(e) => handleInputChange(i, 'qty', e.target.value)}
                                       required/>
                                <small className="form-text text-muted">Boş qoyula bilər</small>
                            </div>
                            <div className="col-lg-2">
                                <label className="mb-0 small ">Qiyməti</label>
                                <input type="text" className="form-control"
                                       value={item.price}
                                       onChange={(e) => handleInputChange(i, 'price', e.target.value)}
                                       required/>
                                <small className="small text-muted">Boş qoyula bilər</small>
                            </div>
                            <div className="col-lg-1 d-flex align-items-center">
                                    <span className="mr-3 text-danger delete-button"
                                          onClick={deletePurchaseItemHandler}>
                                            <i className="fas fa-trash-alt fa-sm"/>
                                    </span>
                                    <span  className="cursor-pointer" data-toggle="tooltip" title={!isEditable ? 'Əlavə et' : 'Düzəlişi təsdiqlə'}
                                        onClick={onUpdateHandler.bind(this, i)}>
                                        <i className="fas fa-check-circle text-success ml-2"/>
                                    </span>
                            </div>
                            {item.purchase.modifiedBy &&
                                <div className="col-12">
                                    <span className="note note-info mb-0 mt-1 note-custom-style">
                                        Sonuncu düzəliş <strong>{item.purchase.modifiedBy}</strong> tərəfindən <strong>{formattedDate(item.purchase.modifiedAt)}</strong> edilib.
                                    </span>
                                </div>
                            }
                        </div>
                    </li>
                ))}
            </ul>
            <div className="d-flex justify-content-end align-items-center mt-3">
                <Button type="button"
                        variant="success"
                        className="mr-2"
                        onClick={addNewPurchaseItem}
                >
                    Yeni sifariş əlavə edin
                </Button>
            </div>
        </div>
    )
}

export default PurchaseItem;