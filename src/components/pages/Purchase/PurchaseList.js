import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {get, remove} from "../../api/Api";
import {formattedDate} from "../../helpers/formattedDate";
import Loader from "react-loader-spinner";

const PurchaseList = () => {
    const params = useParams();
    const userID = params.customerID;
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [purchaseState, setPurchaseState] = useState({
        content: [{
            createdBy: "",
            createdAt: "",
            modifiedBy: "",
            modifiedAt: "",
            id: '',
        }],
        totalPages: '',
        last: '',
        first: '',
        number: '',
        page: 0
    });

    useEffect(() => {
        setIsFetchingData(true)
        get(`purchases/search?customerId.equals=${userID}&page=${purchaseState.page}&size=5`).then(res => {
            setPurchaseState(prevState => ({
                content: res.content,
                totalPages: res.totalPages,
                last: res.last,
                first: res.first,
                number: res.number
            }))
            setIsFetchingData(false);
        }).catch(err => console.log(err))
    }, [userID]);

    const paginate = (page) => {
        setPurchaseState(prevState => ({
            ...prevState,
            page
        }));
        fetchData(page);
    }

    const fetchData = (page) => {
        setIsFetchingData(true)
        get(`purchases/search?customerId.equals=${userID}&page=${page}&size=5`).then(res => {
            setPurchaseState(prevState => ({
                content: res.content,
                totalPages: res.totalPages,
                last: res.last,
                first: res.first,
                number: res.number
            }))
            setIsFetchingData(false);
        }).catch(err => console.log(err))
    }

    const deleteHandle = (id, page) => {
        setIsFetchingData(true);
        console.log(page);
        remove(`/purchases/${id}`).then((res) =>{
            fetchData(page);
            setIsFetchingData(false);
        }).catch((error) => {
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
    } else {
        return (
            <>
                <ul className="list-group">
                    <li className="list-group-item list-group-item-primary d-flex align-items-center justify-content-between">
                        <div className="mb-0 font-family-Roboto-Medium">Sifarişlər</div>
                        <Link to={`/addPurchase/${userID}`} type="button"
                              className="btn btn-primary">
                            Yeni Sifariş
                        </Link>
                    </li>
                    {purchaseState.content.map((purchase, i) => {
                        return (
                            <li className="list-group-item" key={i}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="mb-2 flex-1">
                                        <strong>{formattedDate(purchase.createdAt)}</strong> tarixində <strong>{purchase.createdBy}</strong> tərəfindən
                                        verilən <Link className='mr-3 btn-xs'
                                        to={`/purchase/view?id=${purchase.id}`}
                                        >sifariş</Link>
                                    </div>
                                    <div className='table-actions text-right'>
                                        <Link
                                            className='mr-3 btn-xs'
                                            to={`/purchaseInfo?edit=true&purchase_id=${purchase.id}`}
                                        >
                                            <i className='fas fa-edit fa-sm text-success'/>
                                        </Link>
                                        <span className='ml-2 btn-xs delete-button' onClick={deleteHandle.bind(this, purchase.id, purchaseState.page)}>
                                            <i className="fas fa-trash-alt fa-sm text-danger"/>
                                        </span>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                {purchaseState.totalPages &&
                <div className='row pt-2'>
                    <div className='col-md-6'>
                        <nav aria-label='Page navigation example p-0'>
                            <ul className='pagination mb-0'>
                                <li className={`page-item ${purchaseState.first ? 'disabled' : ''}`}>
                                    <button onClick={paginate.bind(this, purchaseState.page - 1)} type='button'
                                            className='page-link'>
                                        Əvvəlki
                                    </button>
                                </li>
                                {Array.from(Array(purchaseState.totalPages).keys()).map((num) => (
                                    <li key={num}
                                        className={`page-item ${purchaseState.number === num ? 'active' : ''}`}>
                                        <button type='button' onClick={paginate.bind(this, num)}
                                                className='page-link'>{+num + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${purchaseState.last ? 'disabled' : ''}`}>
                                    <button type='button' onClick={paginate.bind(this, purchaseState.page + 1)}
                                            className='page-link'>
                                        Növbəti
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                }
            </>
        )
    }
}

export default PurchaseList;