import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {get, remove} from '../../api/Api';
import {Table} from "react-bootstrap";
import Loader from "react-loader-spinner";
import {useQuery} from "../../hooks/useQuery";

const StatusList = () => {
    const history = useHistory();
    let query = useQuery();
    const currentPage = query.get("page") || 0;
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [hasErr, setHasErr] = useState(false);
    const [page, setPage] = useState(currentPage);
    const [rowNums, setRowNums] = useState(0);
    const [res, setResponse] = useState(0);

    const paginate = (n) => {
        setPage(n);
        history.push({
            pathname: '/status-types',
            search: '?page=' + n + '&size=10'
        })
    }

    const getResponseData = () => {
        get(`/status-types?page=${page}&size=10`)
            .then((res) => {
                setIsFetchingData(false);
                setResponse(res);
                setRowNums(page === 0 ? 1 : (page * 10) + 1);
            })
            .catch((err) => {
                setIsFetchingData(false);
                setHasErr(true);
            });
    };

    useEffect(() => {
        getResponseData();
    }, [page]);

    const deleteHandle = (id) => {
        setIsFetchingData(true)
        remove(`/status-types/${id}`).then((res) => {
            getResponseData();
            setIsFetchingData(false)
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
        <>
            <Table bordered>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Sosial Şəbəkə Növü</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {res?.content && res.content.map(({id, name}, i) => (
                    <tr key={id}>
                        <td className='table-index'>{+i + rowNums}</td>
                        <td>{name}</td>
                        <td className='table-actions text-right'>
                            <Link
                                className='mr-3 btn-xs'
                                to={`/status-type/add?edit=true&id=${id}`}
                            >
                                <i className='fas fa-edit fa-sm text-success'/>
                            </Link>
                            <span className='ml-2 btn-xs delete-button' onClick={deleteHandle.bind(this, id)}>
                                    <i className="fas fa-trash-alt fa-sm text-danger"/>
                                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div className='row pt-2'>
                <div className='col-md-6'>
                    <nav aria-label='Page navigation example p-0'>
                        <ul className='pagination mb-0'>
                            <li className={`page-item ${res?.first ? 'disabled' : ''}`}>
                                <button onClick={paginate.bind(this, page - 1)} type='button' className='page-link'>
                                    Əvvəlki
                                </button>
                            </li>
                            {[...Array(res?.totalPages).keys()].map((num) => (
                                <li key={num} className={`page-item ${res?.number === num ? 'active' : ''}`}>
                                    <button onClick={paginate.bind(this, num)} type='button'
                                            className='page-link'>{+num + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${res?.last ? 'disabled' : ''}`}>
                                <button onClick={paginate.bind(this, page + 1)} type='button' className='page-link'>
                                    Növbəti
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default StatusList;
