import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {get, remove} from "../../api/Api";
import {formattedDate} from "../../helpers/formattedDate";
import {
    Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Loader from "react-loader-spinner";

const PurchaseList = () => {
    const params = useParams();
    const userID = params.customerID;
    const [paginationInfo, setPaginationInfo] = useState({
        totalPages: '',
        last: '',
        first: '',
        number: '',
        page: ''
    });
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isPurchaseNoteLoading, setIsPurchaseNoteLoading] = useState(false);
    const [isPurchaseItemLoading, setIsPurchaseItemLoading] = useState(false);
    const [isPurchaseStatusLoading, setIsPurchaseStatusLoading] = useState(false);
    const [purchaseState, setPurchaseState] = useState([{
        createdBy: "",
        createdAt: "",
        modifiedBy: "",
        modifiedAt: "",
        id: '',
        purchaseItem: [],
        purchaseNote: [],
        purchaseStatus: [],
    }]);

    useEffect(() => {
        setIsFetchingData(true)
        get(`purchases/search?customerId.equals=${userID}&page=${paginationInfo.page}&size=5`).then(res => {
            setPaginationInfo(prevState => ({
                ...prevState,
                totalPages: res.totalPages,
                last: res.last,
                first: res.first,
                number: res.number
            }))
            res.content.length && res.content.map(purchase => {
                setIsPurchaseStatusLoading(true);
                setIsPurchaseNoteLoading(true);
                setIsPurchaseItemLoading(true);
                const resNote = [];
                const resItem = [];
                const resStatus = [];
                get(`purchase-notes/search?purchaseId.equals=${purchase.id}&page=0&size=10`).then(result => {
                    resNote.push(...result.content);
                    setIsPurchaseNoteLoading(false);
                }).catch(err => {console.log(err)});
                get(`purchase-items/search?purchaseId.equals=${purchase.id}&page=0&size=10`).then(result => {
                    resItem.push(...result.content);
                    setIsPurchaseItemLoading(false);
                }).catch(err => { console.log(err) })
                get(`/purchase-statuses/search?purchaseId.equals=${purchase.id}&page=0&size=10`).then(result => {
                    resStatus.push(...result.content)
                    setIsPurchaseStatusLoading(false);
                }).catch(err => {console.log(err)});

                setPurchaseState((prevState => [
                    ...prevState,
                    {
                        createdBy: purchase.createdBy,
                        createdAt: purchase.createdAt,
                        modifiedAt: purchase.modifiedAt,
                        modifiedBy: purchase.modifiedBy,
                        id: purchase.id,
                        purchaseNote: resNote,
                        purchaseItem: resItem,
                        purchaseStatus: resStatus
                    }
                ]));

            })

            !isPurchaseNoteLoading && !isPurchaseStatusLoading && !isPurchaseItemLoading && setIsFetchingData(false);
        }).catch(err => console.log(err))
    }, [userID]);

    const paginate = (page) => {
        setPaginationInfo(prevState => ({
            ...prevState,
            page
        }));
        fetchData(page);
    }

    const fetchData = (page) => {
        setIsFetchingData(true)
        get(`purchases/search?customerId.equals=${userID}&page=${page}&size=5`).then(res => {
            setPaginationInfo(prevState => ({
                ...prevState,
                totalPages: res.totalPages,
                last: res.last,
                first: res.first,
                number: res.number
            }))
            const purchaseArr = [];
            res.content.length && res.content.map(purchase => {
                setIsPurchaseStatusLoading(true);
                setIsPurchaseNoteLoading(true);
                setIsPurchaseItemLoading(true);
                const resNote = [];
                const resItem = [];
                const resStatus = [];
                get(`purchase-notes/search?purchaseId.equals=${purchase.id}&page=0&size=10`).then(result => {
                    resNote.push(...result.content);
                    setIsPurchaseNoteLoading(false);
                }).catch(err => {
                    console.log(err)
                });
                get(`purchase-items/search?purchaseId.equals=${purchase.id}&page=0&size=10`).then(result => {
                    resItem.push(...result.content);
                    console.log(resItem);
                    setIsPurchaseItemLoading(false);
                }).catch(err => {
                    console.log(err)
                })
                get(`/purchase-statuses/search?purchaseId.equals=${purchase.id}&page=0&size=10`).then(result => {
                    resStatus.push(...result.content)
                    setIsPurchaseStatusLoading(false);
                }).catch(err => {
                    console.log(err)
                })
                purchaseArr.push({
                    createdBy: purchase.createdBy,
                    createdAt: purchase.createdAt,
                    modifiedAt: purchase.modifiedAt,
                    modifiedBy: purchase.modifiedBy,
                    id: purchase.id,
                    purchaseNote: resNote,
                    purchaseItem: resItem,
                    purchaseStatus: resStatus
                })
                console.log(purchaseArr);
            })
            setPurchaseState(purchaseArr);
            console.log(purchaseArr);
            !isPurchaseNoteLoading && !isPurchaseStatusLoading && !isPurchaseItemLoading && setIsFetchingData(false);
        }).catch(err => console.log(err))
    }

    const deleteHandle = (id) => {
        setIsFetchingData(true)
        remove(`/purchase-items/${id}`).then((res) => {
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
                    {purchaseState.map((purchase, i) => {
                        return (
                            <li className="list-group-item" key={i}>
                                <div>
                                    <div className="mb-2">
                                        <strong>{formattedDate(purchase.createdAt)}</strong> tarixində <strong>{purchase.createdBy}</strong> tərəfindən
                                        verilən sifariş
                                    </div>
                                    <div className="flex-1">
                                        <Tabs>
                                            <TabList>
                                                <Tab>Sifarişlər</Tab>
                                                <Tab>Qeydlər</Tab>
                                                <Tab>Status</Tab>
                                            </TabList>
                                            <TabPanel>
                                                <table className="table table-bordered table-hover mb-0">
                                                    <thead className="library-table-head">
                                                    <tr>
                                                        <th className="library-table-index" scope="col">#</th>
                                                        <th scope="col">Sifariş adı</th>
                                                        <th scope="col">Ödəniş növü</th>
                                                        <th scope="col">Qiymət</th>
                                                        <th scope="col">Say</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {purchase.purchaseItem.map(({
                                                                                    id,
                                                                                    item,
                                                                                    paymentType,
                                                                                    qty,
                                                                                    price
                                                                                }, k) => {
                                                        return (
                                                            <tr key={k + 1}>
                                                                <td className="table-index width-25">{k + 1}</td>
                                                                <td>{item}</td>
                                                                <td>{paymentType.name}</td>
                                                                <td>{price}</td>
                                                                <td>{qty}</td>
                                                                <td className="table-actions text-right">
                                                                    <Link
                                                                        className='mr-3 btn-xs'
                                                                        to={`/purchaseInfo?edit=true&type=info&id=${userID}&itemID=${id}`}
                                                                    >
                                                                        <i className='fas fa-edit fa-sm text-success'/>
                                                                    </Link>
                                                                    <span className='ml-2 btn-xs delete-button'
                                                                          onClick={deleteHandle.bind(this, id)}>
                                                                <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                            </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                    </tbody>
                                                </table>
                                            </TabPanel>
                                            <TabPanel>
                                                <table className="table table-bordered table-hover mb-0">
                                                    <thead className="library-table-head">
                                                    <tr>
                                                        <th className="library-table-index" scope="col">#</th>
                                                        <th scope="col">Qeyd</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {purchase.purchaseNote.map(({id, note}, k) => {
                                                        return (
                                                            <tr key={k}>
                                                                <td className="table-index width-25">{k}</td>
                                                                <td className="d-flex justify-content-between">
                                                                    <span>{note}</span>
                                                                </td>
                                                                <td className="table-actions text-right">
                                                                    <Link
                                                                        className='mr-3 btn-xs'
                                                                        to={`/purchaseInfo?edit=true&type=info&id=${userID}&itemID=${id}`}
                                                                    >
                                                                        <i className='fas fa-edit fa-sm text-success'/>
                                                                    </Link>
                                                                    <span className='ml-2 btn-xs delete-button'
                                                                          onClick={deleteHandle.bind(this, id)}>
                                                                <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                            </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                    </tbody>
                                                </table>
                                            </TabPanel>
                                            <TabPanel>
                                                <table className="table table-bordered table-hover mb-0">
                                                    <thead className="library-table-head">
                                                    <tr>
                                                        <th className="library-table-index" scope="col">#</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col">Qeyd</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {purchase.purchaseStatus.map(({id, note, statusType}, k) => {
                                                        return (
                                                            <tr key={k + 1}>
                                                                <td className="table-index width-25">{k + 1}</td>
                                                                <td>{statusType.name}</td>
                                                                <td>{note}</td>
                                                                <td className="table-actions text-right">
                                                                    <Link
                                                                        className='mr-3 btn-xs'
                                                                        to={`/purchaseInfo?edit=true&type=info&id=${userID}&itemID=${id}`}
                                                                    >
                                                                        <i className='fas fa-edit fa-sm text-success'/>
                                                                    </Link>
                                                                    <span className='ml-2 btn-xs delete-button'
                                                                          onClick={deleteHandle.bind(this, id)}>
                                                                <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                            </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                    </tbody>
                                                </table>
                                            </TabPanel>
                                        </Tabs>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                {paginationInfo.totalPages &&
                <div className='row pt-2'>
                    <div className='col-md-6'>
                        <nav aria-label='Page navigation example p-0'>
                            <ul className='pagination mb-0'>
                                <li className={`page-item ${paginationInfo.first ? 'disabled' : ''}`}>
                                    <button onClick={paginate.bind(this, paginationInfo.page - 1)} type='button'
                                            className='page-link'>
                                        Əvvəlki
                                    </button>
                                </li>
                                {[...Array(paginationInfo.totalPages).keys()].map((num) => (
                                    <li key={num}
                                        className={`page-item ${paginationInfo.number === num ? 'active' : ''}`}>
                                        <button type='button' onClick={paginate.bind(this, num)}
                                                className='page-link'>{+num + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${paginationInfo.last ? 'disabled' : ''}`}>
                                    <button type='button' onClick={paginate.bind(this, paginationInfo.page + 1)}
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