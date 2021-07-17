import React, {useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {get, post} from "../../api/Api";
import {useQuery} from "../../hooks/useQuery";
import Loader from "react-loader-spinner";

const PurchaseNote = () => {
    const query = useQuery();
    const purchase_id = query.get("purchaseID");
    const type = query.get("type");
    const item_id = query.get("itemID");
    const isEditable = query.get("edit");
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [purchaseItem, setPurchaseItem] = useState([
        {
            "purchase": {
                "id": purchase_id
            },
            "note": ''
        }
    ])

    useEffect(() => {
        if(isEditable && type==='note'){
            getData();
        }
    }, []);

    const getData = () => {
        get(`/purchase-notes/${item_id}`).then((res) => {
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
                "note": ""
            }
        ]))
    }

    const handleInputChange = (i, type, value) => {
        let alldata = [...purchaseItem];
        alldata[i] = {
            ...alldata[i],
            [type]: value
        }
        setPurchaseItem(alldata);
    }

    const deletePurchaseItemHandler = () => {

    }

    const onUpdateHandler = (index, event) => {
        event.preventDefault();
        setIsLoading(true);
        post('/purchase-notes', purchaseItem[index]).then((res) => {
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
                            <div className="col-lg-8">
                                <label className="mb-0 small ">Sifariş Qeydi</label>
                                <input type="text" className="form-control"
                                       onChange={(e) => handleInputChange(i, 'note', e.target.value)} value={item.note}
                                       required/>
                            </div>
                            <div className="col-lg-1 d-flex align-items-center">
                                    <span className="mr-3 text-danger delete-button"
                                          onClick={deletePurchaseItemHandler}>
                                            <i className="fas fa-trash-alt fa-sm"/>
                                    </span>
                                <span data-toggle="tooltip" title={!isEditable ? 'Əlavə et' : 'Düzəlişi təsdiqlə'}
                                      onClick={onUpdateHandler.bind(this, i)}>
                                        <i className="fas fa-check-circle text-success ml-2"/>
                                    </span>
                            </div>
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

export default PurchaseNote;