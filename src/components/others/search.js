import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {get} from "../api/Api";
import axios from "axios";

let token = '';

const Search = (props) => {
    const [state, setState] = useState({
        query: '',
        results: {},
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
            setState(prevState => ({
                ...prevState,
                isloading: false,
                message: messageInfo,
                results: res
            }));
        }).catch((error) => {
            if (axios.isCancel(error) || error) {
                const messageInfo = error?.response?.data?.message
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
        if (query) {
            setState(prevState => ({
                    ...prevState,
                    query,
                }
            ));
            fetchSearchResults(state.page, query);
        } else {
            setState({
                query: '',
                results: {},
                isloading: false,
                message: '',
                page: 0
            });
        }
    };

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
                />
                <i className="fa fa-search search-icon"/>
            </div>
            <div className="search-result">
                {props.type === "name" || props.type === "surname" ?
                    state.results?.content && state.results?.content?.map((result) => (
                        <Link to={`customerInfo/${result.id}`}
                        className="list-group-item list-group-item-action"
                        key={result.id}>{result.name} {result.surname}</Link>
                        ))
                    : null
                }
                {props.type === "contact" || props.type === "address" ?
                    state.results?.content && state.results?.content?.map((result) => (
                        <Link to={`customerInfo/${result.customer.id}`}
                              className="list-group-item list-group-item-action"
                              key={result.id}> {result[props.type]} - {result.customer.name} {result.customer.surname}

                        </Link>
                    )) : null
                }
                {state.message}
                {state.results?.content && state.results?.totalPages && <div className='row pt-2'>
                    <div className='col-md-6'>
                        <nav aria-label='Page navigation example p-0'>
                            <ul className='pagination mb-0'>
                                <li className={`page-item ${state.results?.first ? 'disabled' : ''}`}>
                                    <button onClick={paginate.bind(this, state.page - 1)} type='button'
                                            className='page-link'>
                                        Əvvəlki
                                    </button>
                                </li>
                                {[...Array(state.results?.totalPages).keys()].map((num) => (
                                    <li key={num}
                                        className={`page-item ${state.results?.number === num ? 'active' : ''}`}>
                                        <button type='button' onClick={paginate.bind(this, num)}
                                                className='page-link'>{+num + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${state.results?.last ? 'disabled' : ''}`}>
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


