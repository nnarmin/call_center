import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {get, remove} from '../../api/Api';
import {Table, Card, Button} from "react-bootstrap";

const PaymentList = () => {

    const [isLoading, setIsloading] = useState(true);
    const [hasErr, setHasErr] = useState(false);
    const [page, setPage] = useState(0);
    const [rowNums, setRowNums] = useState(0);
    const [res, setResponse] = useState(0);

    const getResponseData = () => {
        get(`/payment-types?page=${page}&size=10`)
            .then((res) => {
                setIsloading(false);
                setResponse(res);
                setRowNums(page === 0 ? 1 : (page * 10) + 1);
            })
            .catch((err) => {
                setIsloading(false);
                setHasErr(true);
            });
    };

    useEffect(() => {
        getResponseData();
    }, [page]);

    const deleteHandle = (id) => {
        remove(`/payment-types/${id}`).then((res) => {
            getResponseData();
        })
    };

    if (isLoading) {
        return <p>Loading..</p>
    }

    if (hasErr) {
        return <></>;
    }
    return (
        <Card>
            <Card.Body>
                <Link to="/paymentMethod/add" className="d-flex justify-content-end mb-3"><Button variant="primary"> Yeni
                        Ödəniş üsulu </Button></Link>
                <Table bordered>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Ödəniş Növü</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {res?.content && res.content.map(({id, name}, i) => (
                        <tr key={id}>
                            <td className='library-table-index'>{+i + rowNums}</td>
                            <td>{name}</td>
                            <td className='library-table-actions'>
                                <Link
                                    className='mr-2 btn-xs'
                                    to={`template/add?edit=true&id=${id}`}
                                >
                                    <i className='fas fa-edit fa-sm text-warning'/>
                                </Link>
                                <span className='mr-sm btn-xs delete2' onClick={deleteHandle.bind(this, id)}>
                                    <i className='fas fa-trash fa-sm text-danger'/>
                                </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className='row pt-2'>
                    <div className='col-md-4'>
                        <nav aria-label='Page navigation example p-0'>
                            <ul className='pagination mb-0'>
                                <li className={`page-item ${res?.first ? 'disabled' : ''}`}>
                                    <button onClick={() => setPage(page - 1)} type='button' className='page-link'>
                                        Əvvəlki
                                    </button>
                                </li>
                                {Array.from(Array(res?.totalPages).keys()).map((num) => (
                                    <li key={num} className={`page-item ${res?.number === num ? 'active' : ''}`}>
                                        <button onClick={() => setPage(num)} type='button'
                                                className='page-link'>{+num + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${res?.last ? 'disabled' : ''}`}>
                                    <button onClick={() => setPage(page + 1)} type='button' className='page-link'>
                                        Növbəti
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className='col-md-4'>
                        <div className='text-muted text-center'>
                        <span>
                          Toplam məlumat:
                            {' '}
                            {res?.totalElements}
                        </span>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PaymentList;
