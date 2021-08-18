import React, {useEffect, useState} from 'react';
import {get} from "../../api/Api";
import {Table} from "react-bootstrap";
import Loader from "react-loader-spinner";
import {Link, useHistory} from "react-router-dom";

const PurchaseStatusesItem = () => {
    const history = useHistory();
    const [purchaseList, setPurchaseList] = useState([]);
    const [paginateInfo, setPaginateInfo] = useState([]);
    const [page, setPage] = useState(0);
    const search_param = history.location.search;
    const search_type = history.location.search.split('?').pop().split('&')[0];

    const [isFetchingData, setIsFetchingData] = useState(true);
    const [rowNums, setRowNums] = useState(0);

    const paginate = (n) => {
        setPage(n);
        history.push({
            pathname: '/purchase-statuses',
            search: '?page=' + n + '&size=10'
        })
    }

    useEffect(() => {
        get(`/purchase-statuses/search${search_param}`)
            .then((res) => {
                setPaginateInfo(res);
                setRowNums(page === 0 ? 1 : (page * 10) + 1);
                res.content.map(purchase => {
                    console.log(purchase)
                    get(`purchases/${purchase.purchase.id}`).then(response => {
                        setPurchaseList(prevState => ([
                            ...prevState,
                            {
                                ...purchase,
                                customer: response.customer
                            }
                        ]));
                    })
                })
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
                            <th>Müştəri</th>
                            <th>Status növü</th>
                            <th>Qeyd</th>
                        </tr>
                        </thead>
                        <tbody>
                        {purchaseList && purchaseList.map(({statusType, note, id, customer}, i) => (
                            <tr key={id}>
                                <td className='table-index'>{+i + rowNums}</td>
                                <td><Link to={`customerInfo/${customer.id}`}>{customer.name} {customer.surname}</Link></td>
                                <td>{statusType.name}</td>
                                <td>{note}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
                <div className='row pt-2'>
                    <div className='col-md-12'>
                        <nav aria-label='Page navigation example p-0'>
                            <ul className='pagination mb-0'>
                                <li className={`page-item ${paginateInfo?.first ? 'disabled' : ''}`}>
                                    <button onClick={paginate.bind(this, page - 1)} type='button' className='page-link'>
                                        Əvvəlki
                                    </button>
                                </li>
                                {[...Array(paginateInfo?.totalPages).keys()].map((num) => (
                                    <li key={num}
                                        className={`page-item ${paginateInfo?.number === num ? 'active' : ''}`}>
                                        <button onClick={paginate.bind(this, num)} type='button'
                                                className='page-link'>{+num + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${paginateInfo?.last ? 'disabled' : ''}`}>
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

export default PurchaseStatusesItem;