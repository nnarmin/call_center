import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {get, remove} from "../../api/Api";
import {formattedDate} from "../../helpers/formattedDate";
import Loader from "react-loader-spinner";

const PurchaseList = () => {

    const params = useParams();
    const userID = params.customerID;

    const [isFetchingPurchases, setIsFetchingPurchases] = useState(true)
    const [purchases, setPurchases] = useState({});
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
        getCustomerPurchases(userID);
    }, []);

    const getCustomerPurchases = (userID) => {
        setIsFetchingData(true)
        get(`/purchases/search?customerId.equals=${userID}&page=0&size=20`).then((res) => {
            const purchaseArr = [];
            res.content?.map(purchaseInfo => {
                get(`/purchase-items/search?purchaseId.equals=${purchaseInfo.id}&page=0&size=20`).then(result => {
                    setIsFetchingPurchases(true);
                    if (result.content && result.content.length) {
                        purchaseArr.push(result.content)
                        setIsFetchingPurchases(false);
                    }
                    setPurchases(purchaseArr);
                }).catch(err => {
                    setIsFetchingPurchases(false);
                })
            })
            setIsFetchingData(false)
        }).catch((err) => {
            setIsFetchingData(false);
        })
    }

    const deleteHandle = (id) => {
        setIsFetchingData(true)
        remove(`/purchase-items/${id}`).then((res) => {
            getCustomerPurchases(userID);
        }).catch((error)=>{
            setIsFetchingData(false)
        })
    };

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
        <ul className="list-group">
            <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                <div className="mb-0 font-family-Roboto-Medium">Sifarişlər</div>
                <Link to={`/addPurchase/${userID}`} type="button"
                      className="btn btn-primary">
                    Yeni Sifariş
                </Link>
            </li>
            {purchases.length && purchases.map((purchase, i) => (
                <li className="list-group-item" key={i}>
                    <div className="d-flex">
                        <strong className="width-25 mr-2">#{i}</strong>
                        <div className="flex-1">
                            <table className="table table-bordered mb-0">
                                <tbody>
                                {purchase.length && purchase.map((info, k) => (
                                    <tr key={k}>
                                        <td className="table-index width-25">{k}</td>
                                        <td>
                                            <span className="mr-2">Sifariş - <strong>{info.item}</strong></span>
                                            <span className="note note-info mb-0 mt-1 note-custom-style">
                                                Sonuncu düzəliş <strong>{info.purchase.modifiedBy}</strong> tərəfindən <strong>{formattedDate(info.purchase.modifiedAt)}</strong> edilib.
                                            </span>
                                        </td>
                                        <td className="table-actions text-right">
                                            <Link
                                                className='mr-3 btn-xs'
                                                to={`/purchaseInfo?edit=true&type=info&id=${userID}&itemID=${info.id}`}
                                            >
                                                <i className='fas fa-edit fa-sm text-success'/>
                                            </Link>
                                            <span className='ml-2 btn-xs delete-button'
                                                  onClick={deleteHandle.bind(this, info.id)}>
                                                <i className="fas fa-trash-alt fa-sm text-danger"/>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </li>
            ))}
            {!purchases.length && <p className="mt-2 text-center">Heç bir sifariş əlavə edilməyib.</p>}
        </ul>
    )
}

export default PurchaseList;