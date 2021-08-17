import React, {useEffect, useState} from 'react';
import {get} from "../../api/Api";
import {Table} from "react-bootstrap";
import Loader from "react-loader-spinner";
import {useHistory} from "react-router-dom";

const PurchaseItemList = () => {
    const history = useHistory();
    const [purchaseList, setPurchaseList] = useState();
    const [page, setPage] = useState(0);
    const search_param = history.location.search;

    const [isFetchingData, setIsFetchingData] = useState(true);
    const [rowNums, setRowNums] = useState(0);

    const paginate = (n) => {
        setPage(n);
        history.push({
            pathname: '/purchase-items',
            search: '?page=' + n + '&size=10'
        })
    }

    useEffect(() => {
        get(`/purchase-items/search${search_param}`)
            .then((res) => {
                setPurchaseList(res);
                /*res.content.map(purchase => {
                    console.log(purchase)
                    get(`purchases/${purchase.purchase.id}`).then(response => {
                        setPurchaseList(prevState => [
                            {
                                ...purchase,
                                ...response
                            }
                        ])
                    })
                })*/
            })
            .catch((err) => {
                setIsFetchingData(false);
            }).finally(() => setIsFetchingData(false));
    }, []);


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
        <div className="card">
            <div className="card-body">
                <div className="table-responsive">
                    <Table bordered>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Məhsul</th>
                            <th>Ödəniş növü</th>
                            <th>Sayı</th>
                            <th>Qiyməti</th>
                        </tr>
                        </thead>
                        <tbody>
                        {purchaseList?.content && purchaseList?.content.map(({item, price, paymentType, qty, id}, i) => (
                            <tr key={id}>
                                <td className='table-index'>{+i + rowNums}</td>
                                <td>{item}</td>
                                <td>{paymentType.name}</td>
                                <td>{qty}</td>
                                <td>{price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
                <div className='row pt-2'>
                    <div className='col-md-12'>
                        <nav aria-label='Page navigation example p-0'>
                            <ul className='pagination mb-0'>
                                <li className={`page-item ${purchaseList?.first ? 'disabled' : ''}`}>
                                    <button onClick={paginate.bind(this, page - 1)} type='button' className='page-link'>
                                        Əvvəlki
                                    </button>
                                </li>
                                {[...Array(purchaseList?.totalPages).keys()].map((num) => (
                                    <li key={num}
                                        className={`page-item ${purchaseList?.number === num ? 'active' : ''}`}>
                                        <button onClick={paginate.bind(this, num)} type='button'
                                                className='page-link'>{+num + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${purchaseList?.last ? 'disabled' : ''}`}>
                                    <button onClick={paginate.bind(this, page + 1)} type='button' className='page-link'>
                                        Növbəti
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchaseItemList;