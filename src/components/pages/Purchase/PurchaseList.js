import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {get, remove, gett} from "../../api/Api";
import {formattedDate} from "../../helpers/formattedDate";
import DeleteConfirmation from "../../others/ConfirmationModal";
import {
    Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Loader from "react-loader-spinner";
import {set} from "mdb-ui-kit/src/js/mdb/perfect-scrollbar/lib/css";

const PurchaseList = () => {
    const params = useParams();
    const userID = params.customerID;
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [paginationInfo, setPaginationInfo] = useState({
        totalPages: '',
        last: '',
        first: '',
        number: '',
        page: 0
    });
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [purchaseState, setPurchaseState] = useState([]);
    const [type, setType] = useState('');
    const [key, setKey] = useState('');
    const [id, setId] = useState('');

    useEffect(async() => {
        setIsFetchingData(true);
        await setPurchaseState(purchaseList(0));
        // console.log(purchaseState)

        setIsFetchingData(false);
        // await get(`purchases/search?customerId.equals=${userID}&page=${paginationInfo.page}&size=3&sort=id,desc`).then(res => {
        //     setPaginationInfo(prevState => ({
        //         ...prevState,
        //         totalPages: res.totalPages,
        //         last: res.last,
        //         first: res.first,
        //         number: res.number
        //     }))
        //     res.content.length && res.content.map(purchase => {
        //         const resNote = [];
        //         const resItem = [];
        //         const resStatus = [];
        //
        //         Promise.all([getPurchaseItem(purchase.id), getPurchaseNote(purchase.id), getPurchaseStatus(purchase.id)])
        //             .then(function (results) {
        //                 resItem.push(...results[0].data.content);
        //                 resNote.push(...results[1].data.content);
        //                 resStatus.push(...results[2].data.content);
        //
        //                 console.log(`resItem-${purchase.id}`, resItem)
        //                 console.log(`resNote-${purchase.id}`, resNote)
        //                 console.log(`resStatus-${purchase.id}`, resStatus);
        //
        //                 setPurchaseState(prevState => (
        //                     [
        //                     ...prevState,
        //                     {
        //                         createdBy: purchase.createdBy,
        //                         createdAt: purchase.createdAt,
        //                         modifiedAt: purchase.modifiedAt,
        //                         modifiedBy: purchase.modifiedBy,
        //                         id: purchase.id,
        //                         purchaseNote: resNote,
        //                         purchaseItem: resItem,
        //                         purchaseStatus: resStatus
        //                     }
        //                 ]
        //                 ))
        //             });
        //     })
        //
        // }).catch(err => console.log(err)).finally(() => {
        //     setIsFetchingData(false)
        // })
    }, []);

    async function purchaseList(page) {
        const purchaseArr =[];
        await get(`purchases/search?customerId.equals=${userID}&page=${page}&size=3&sort=id,desc`).then(res => {
            res.content.length && res.content.forEach(purchase => {
                const resNote = [];
                const resItem = [];
                const resStatus = [];

                Promise.all([getPurchaseItem(purchase.id), getPurchaseNote(purchase.id), getPurchaseStatus(purchase.id)])
                    .then(function (results) {
                        resItem.push(...results[0].data.content);
                        resNote.push(...results[1].data.content);
                        resStatus.push(...results[2].data.content);

                        console.log(`resItem-${purchase.id}`, resItem)
                        console.log(`resNote-${purchase.id}`, resNote)
                        console.log(`resStatus-${purchase.id}`, resStatus);

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

                        purchaseArr.sort(
                            (a, b) => parseInt(b.id) - parseInt(a.id)
                        );

                    });
            })

        }).catch(err => console.log(err))
        console.log("purchaseArr",purchaseArr);
    }

    function getPurchaseItem(id) {
        return gett(`/purchase-items/search?purchaseId.equals=${id}&page=0&size=5`);
    }

    function getPurchaseStatus(id) {
        return gett(`/purchase-statuses/search?purchaseId.equals=${id}&page=0&size=5`);
    }

    function getPurchaseNote(id) {
        return gett(`/purchase-notes/search?purchaseId.equals=${id}&page=0&size=5`);
    }


    const paginate = (page) => {
        setPaginationInfo(prevState => ({
            ...prevState,
            page
        }));
        fetchData(page);
    }

    const fetchData = async (page) => {
        setIsFetchingData(true);
        setPurchaseState([]);
        await get(`purchases/search?customerId.equals=${userID}&page=${page}&size=3&sort=id,desc`).then(res => {
            setPaginationInfo(prevState => ({
                ...prevState,
                totalPages: res.totalPages,
                last: res.last,
                first: res.first,
                number: res.number
            }))
            res.content.length && res.content.forEach(purchase => {
                const resNote = [];
                const resItem = [];
                const resStatus = [];
                console.log(purchase.id);
                Promise.all([getPurchaseItem(purchase.id), getPurchaseNote(purchase.id), getPurchaseStatus(purchase.id)])
                    .then(function (results) {
                        resItem.push(...results[0].data.content);
                        resNote.push(...results[1].data.content);
                        resStatus.push(...results[2].data.content);
                        console.log(`resItem-${purchase.id}`, resItem)
                        console.log(`resNote-${purchase.id}`, resNote)
                        console.log(`resStatus-${purchase.id}`, resStatus);
                        setPurchaseState(prevState => ([
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
                        ]))
                    });
            })

        }).catch(err => console.log(err)).finally(() => {
            setIsFetchingData(false)
        })
    }

    const showDeleteModal = (key, type, id) => {
        setType(type);
        setId(id);
        setKey(key);
        setDeleteMessage(`Məlumatı silmək istədiyinizdən əminsiniz?`);
        setDisplayConfirmationModal(true);
    };

    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    const deleteHandle = (key, type, id) => {
        remove(`${type}/${id}`).then(res => {
            fetchData(paginationInfo.page);
            setIsFetchingData(false);
        }).catch(err => {
            setIsFetchingData(false);
        });
        setDisplayConfirmationModal(false);
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
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="mb-2 flex-1">
                                            <strong>{formattedDate(purchase.createdAt)}</strong> tarixində <strong>{purchase.createdBy}</strong> tərəfindən
                                            verilən sifariş.
                                        </div>
                                        <div>
                                            <span className="mr-3 btn-danger btn btn-floating btn-xs delete-button"
                                                  onClick={showDeleteModal.bind(this, 0, "purchases", purchase.id)}>
                                                    <i className="fas fa-trash-alt fa-sm"/>
                                            </span>
                                        </div>
                                    </div>
                                    {console.log(purchase)}
                                    <div className="flex-1">
                                        <Tabs>
                                            <TabList>
                                                <Tab>Sifarişlər</Tab>
                                                <Tab>Qeydlər</Tab>
                                                <Tab>Status</Tab>
                                            </TabList>
                                            <TabPanel>
                                                <div className="text-right"><Link
                                                    to={`/purchase/add?type=info&purchase_id=${purchase.id}`}
                                                    className="btn btn-success mb-2">Yeni Məhsul</Link></div>
                                                Sifaris Id : {purchase.id}
                                                {purchase.purchaseItem.length ? (
                                                        <div className="table-responsive">
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
                                                                                    to={`/purchase/add?edit=true&type=info&purchase_id=${purchase.id}&id=${id}`}
                                                                                >
                                                                                    <i className='fas fa-edit fa-sm text-success'/>
                                                                                </Link>
                                                                                <span className='ml-2 btn-xs delete-button'
                                                                                      onClick={showDeleteModal.bind(this, 0, "purchase-items", id)}>
                                                                                    <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                                </tbody>
                                                            </table>
                                                        </div>)
                                                    : <p className="text-center">Sifariş məhsulu daxil edilməyib.</p>}
                                            </TabPanel>
                                            <TabPanel>
                                                <div className="text-right"><Link
                                                    to={`/purchase/add?type=note&purchase_id=${purchase.id}`}
                                                    className="btn btn-success mb-2">Yeni Qeyd</Link></div>
                                                {purchase.purchaseNote.length ? (
                                                        <div className="table-responsive">
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
                                                                                    to={`/purchase/add?edit=true&type=note&purchase_id=${purchase.id}&id=${id}`}
                                                                                >
                                                                                    <i className='fas fa-edit fa-sm text-success'/>
                                                                                </Link>
                                                                                <span className='ml-2 btn-xs delete-button'
                                                                                      onClick={showDeleteModal.bind(this, 0, "purchase-notes", id)}>
                                                                                <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                                            </span>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                                </tbody>
                                                            </table>
                                                        </div>)
                                                    : <p className="text-center">Sifariş qeydi daxil edilməyib.</p>}
                                            </TabPanel>
                                            <TabPanel>
                                                <div className="text-right"><Link
                                                    to={`/purchase/add?type=status&purchase_id=${purchase.id}`}
                                                    className="btn btn-success mb-2">Yeni Status</Link></div>
                                                {purchase.purchaseStatus.length ?
                                                    (<div className="table-responsive">
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
                                                            {purchase.purchaseStatus.map(({
                                                                                              id,
                                                                                              note,
                                                                                              statusType
                                                                                          }, k) => {
                                                                return (
                                                                    <tr key={k + 1}>
                                                                        <td className="table-index width-25">{k + 1}</td>
                                                                        <td>{statusType.name}</td>
                                                                        <td>{note}</td>
                                                                        <td className="table-actions text-right">
                                                                            <Link
                                                                                className='mr-3 btn-xs'
                                                                                to={`/purchase/add?edit=true&type=status&purchase_id=${purchase.id}&id=${id}`}
                                                                            >
                                                                                <i className='fas fa-edit fa-sm text-success'/>
                                                                            </Link>
                                                                            <span className='ml-2 btn-xs delete-button'
                                                                                  onClick={showDeleteModal.bind(this, 0, "purchase-statuses", id)}>
                                                                            <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                                        </span>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                            </tbody>
                                                        </table>
                                                    </div>)
                                                    : <p className="text-center">Sifariş statusu daxil edilməyib.</p>}
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
                <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={deleteHandle}
                                    hideModal={hideConfirmationModal} type={type} id={id} index={key}
                                    message={deleteMessage}/>
            </>
        )
    }
}

export default PurchaseList;