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
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [purchaseState, setPurchaseState] = useState([
        {
            createdBy: "",
            createdAt: "",
            modifiedBy: "",
            modifiedAt: "",
            id: '',
            purchaseItem: [],
            purchaseNote: [{
                createdBy: "",
                createdAt: "",
                modifiedBy: "",
                modifiedAt: "",
                id: '',
                note: ''
            },],
            purchaseStatus: ''
        }
    ]);


    useEffect( () => {
        setIsFetchingData(true);
        get(`purchases/search?customerId.equals=${userID}&page=0&size=40`).then(res => {
            const purchaseArr = [];
            res.content.length && res.content.map(purchase => (
                purchaseArr.push({
                    createdBy: purchase.createdBy,
                    createdAt: purchase.createdAt,
                    modifiedAt: purchase.modifiedAt,
                    modifiedBy: purchase.modifiedBy,
                    id: purchase.id,
                    purchaseItem: [],
                    purchaseNote: [],
                    purchaseStatus: []
                })
            ))
            purchaseArr.length && purchaseArr.map((purchase, i) => {
                get(`purchase-notes/search?purchaseId.equals=${purchase.id}&page=0&size=20`).then(res => {
                    purchaseArr[i].purchaseNote.push(...res.content);
                }).catch(err => {console.log(err);});
                get(`purchase-items/search?purchaseId.equals=${purchase.id}&page=0&size=20`).then(res => {
                    purchaseArr[i].purchaseItem.push(...res.content);
                }).catch(err => {console.log(err)})
                get(`/purchase-statuses/search?purchaseId.equals=${purchase.id}&page=0&size=20`).then(res => {
                    purchaseArr[i].purchaseStatus.push(...res.content);
                }).catch(err => {console.log(err)})
            })
            setPurchaseState(purchaseArr);
            setIsFetchingData(false);
            console.log(purchaseState);
        }).catch(err => {
            setIsFetchingData(false);
        })
    }, [userID]);

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
            {purchaseState && purchaseState.map((purchase, i) => (
                <li className="list-group-item" key={i}>
                    <div>
                        <div className="mb-2">
                            <strong>{formattedDate(purchase.createdAt)}</strong> tarixində <strong>{purchase.createdBy}</strong> tərəfindən
                            verilən sifariş
                        </div>
                        <div className="flex-1">
                            {console.log(purchase)
                           /* <Tabs>
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
                                        {purchase.purchaseItem.map((info, k) => (
                                            console.log(info)
                                            /!*<tr key={k}>
                                                <td className="table-index width-25">{k}</td>
                                                <td className="d-flex justify-content-between">
                                                    <span>{info.item}</span>
                                                </td>
                                                <td>{info.paymentType.name}</td>
                                                <td>{info.price}</td>
                                                <td>{info.qty}</td>
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
                                            </tr>*!/
                                        ))}
                                        </tbody>
                                    </table>
                                </TabPanel>
                                <TabPanel>

                                </TabPanel>
                                <TabPanel>

                                </TabPanel>
                            </Tabs>*/
                            }
                        </div>
                    </div>
                </li>
            ))}
            <li className="list-group-item text-center">Heç bir sifariş əlavə edilməyib.</li>
        </ul>
    )
}

export default PurchaseList;