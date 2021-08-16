import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {get} from "../api/Api";
import axios from "axios";

let token = '';

const Search = (props) => {
    const [result, setResult] = useState([]);
    const [state, setState] = useState({
        query: '',
        isloading: false,
        message: '',
        page: 0,
        type: ''
    })

    const paginate = (page) => {
        setState(prevState => ({
            ...prevState,
            page,
        }));
        fetchSearchResults(page, state.query);
    }

    const fetchSearchResults = (pageNumber, query) => {
        if (token) {
            token.cancel();
        }
        token = axios.CancelToken.source();
        const searchUrl = `${props.search_url}=${query}&page=${pageNumber}&size=10`;
        setState(prevState => ({
            ...prevState,
            isloading: true,
        }));

        get(searchUrl, {
            cancelToken: token.token
        }).then((res) => {
            const messageInfo = res?.content?.length ? '' : 'Axtarışa uyğun nəticə tapılmadı.';
            setResult(res);
            setState(prevState => ({
                ...prevState,
                isloading: false,
                message: messageInfo
            }));
        }).catch((error) => {
            if (axios.isCancel(error) || error) {
                const messageInfo = error?.response?.data?.message;
                setResult([]);
                setState(prevState => ({
                    ...prevState,
                    isloading: false,
                    message: messageInfo,
                }));
            }
        });
    };

    const handleOnInputChange = (event) => {
        const query = event.target.value;
        setState(prevState => ({
                ...prevState,
                query,
            }
        ));

        if(query){
            fetchSearchResults(state.page, query);
        } else {
            setResult([]);
            setState({
                query: '',
                isloading: false,
                message: '',
                page: 0
            });
        }

    };

    const onSearchClick = () => {
        if (state.query) {
            fetchSearchResults(state.page, state.query);
        } else {
            setResult([]);
            setState({
                query: '',
                isloading: false,
                message: '',
                page: 0
            });
        }
    }

    return (
        <React.Fragment>
            <div className="form-group position-relative">
                <label className="search-label font-weight-bolder">{props.label}</label>
                <input
                    type="text"
                    value={state.query}
                    placeholder={props.placeholder}
                    className="form-control"
                    autoComplete="off"
                    onChange={handleOnInputChange}
                />{/*
                <button type="button" onClick={onSearchClick} className="btn btn-success">
                    <i className="fa fa-search btn-xs"/>
                </button>*/}
            </div>
            <div className="search-result">
                {props.type === "name" || props.type === "surname" ?
                    result?.content && result?.content?.map((result) => (
                        <Link to={`customerInfo/${result.id}`}
                              className="list-group-item list-group-item-action"
                              key={result.id}>{result.name} {result.surname}</Link>
                    ))
                    : null
                }
                {props.type === "contact" || props.type === "address" ?
                    result?.content && result?.content?.map((result) => (
                        <Link to={`customerInfo/${result.customer.id}`}
                              className="list-group-item list-group-item-action"
                              key={result.id}> {result[props.type]} - {result.customer.name} {result.customer.surname}

                        </Link>
                    )) : null
                }
                {state.message}
                {result?.content && result?.totalPages && <div className='row pt-2'>
                    <div className='col-md-6'>
                        <nav aria-label='Page navigation example p-0'>
                            <ul className='pagination mb-0'>
                                <li className={`page-item ${result?.first ? 'disabled' : ''}`}>
                                    <button onClick={paginate.bind(this, state.page - 1)} type='button'
                                            className='page-link'>
                                        Əvvəlki
                                    </button>
                                </li>
                                {[...Array(result?.totalPages).keys()].map((num) => (
                                    <li key={num}
                                        className={`page-item ${result?.number === num ? 'active' : ''}`}>
                                        <button type='button' onClick={paginate.bind(this, num)}
                                                className='page-link'>{+num + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${result?.last ? 'disabled' : ''}`}>
                                    <button type='button' onClick={paginate.bind(this, state.page + 1)}
                                            className='page-link'>
                                        Növbəti
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                }
            </div>
        </React.Fragment>
    )

}
export default Search;


