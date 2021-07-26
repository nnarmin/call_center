import React, {useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {get, post} from "../../api/Api";
import {useQuery} from "../../hooks/useQuery";
import Loader from "react-loader-spinner";

const PurchaseNote = () => {
    const query = useQuery();
    const purchase_id = query.get("purchase_id");
    const type = query.get("type");
    const item_id = query.get("id");
    const isEditable = query.get("edit");
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [purchaseNote, setPurchaseNote] = useState([
        {
            "createdBy": '',
            "createdAt": "",
            "modifiedBy": "",
            "modifiedAt": "",
            "id": '',
            "purchase": {
                "createdBy": '',
                "createdAt": '',
                "modifiedBy": '',
                "modifiedAt": '',
                "id": purchase_id
            },
            "note": ""
        }
    ])

    useEffect(() => {
        if(isEditable){
            getData();
        }
    }, []);

    const getData = () => {
        if(purchase_id){
            get(`/purchase-notes/search?purchaseId.equals=${purchase_id}&page=0&size=10`).then((res) => {
                setPurchaseNote(res.content);
                setIsFetchingData(false);
            }).catch(err => setIsFetchingData(false))
        }else{
            get(`/purchase-notes/${item_id}`).then((res) => {
                setPurchaseNote([res]);
                setIsFetchingData(false);
            }).catch(() => {
                setIsFetchingData(false);
            })
        }
    }

    const addNewPurchaseItem = () => {
        setPurchaseNote((prevState) => ([
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
        let alldata = [...setPurchaseNote];
        alldata[i] = {
            ...alldata[i],
            [type]: value
        }
        setPurchaseNote(alldata);
    }

    const deletePurchaseItemHandler = () => {

    }

    const onUpdateHandler = (index, event) => {
        event.preventDefault();
        setIsLoading(true);
        if(isEditable){

        }else{
            post('/purchase-notes', setPurchaseNote[index]).then((res) => {
                setIsLoading(false);
            }).catch(err => {
                setIsLoading(false);
            })
        }

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
                {purchaseNote.length && purchaseNote.map((item, i) => (
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