import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {get} from "../api/Api";
import axios from "axios";

let token = '';

const Search = (props) => {
    /*    const [query, setQuery] = useState('');
        const [results, setResults] = useState([]);
        const [isloading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [page, setPage] = useState(0);*/

    const [state, setState] = useState({
        query: '',
        results: {},
        isloading: false,
        message: '',
        page: 0
    })

    const paginate = (page) => {
        setState(prevState => ({
            ...prevState,
            page,
        }));
    }

    const fetchSearchResults = (pageNumber, query) => {

        if (token) {
            token.cancel();
            console.log("cancelled")
        }
        token = axios.CancelToken.source();
        const searchUrl = `${props.search_url}=${query}&page=${pageNumber}&size=2`;
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

            console.log(state.results);

        }
    };

    return (
        <React.Fragment>
            <div className="form-group position-relative">
                <label className="search-label">{props.label}</label>
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
                {state.results?.content && state.results?.content?.map((result) => (
                    <Link to={`user/${result.id}`}
                          className="list-group-item list-group-item-action"
                          key={result.id}>{result.name} {result.surname}</Link>
                ))
                }
                {state.message}
                {state.results?.content && state.results?.totalPages && <div className='row pt-2'>
                    <div className='col-md-4'>
                        <nav aria-label='Page navigation example p-0'>
                            <ul className='pagination mb-0'>
                                <li className={`page-item ${state.results?.first ? 'disabled' : ''}`}>
                                    <button onClick={paginate.bind(this, state.page - 1)} type='button'
                                            className='page-link'>
                                        Əvvəlki
                                    </button>
                                </li>
                                {Array.from(Array(state.results?.totalPages).keys()).map((num) => (
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
                    <div className='col-md-4'>
                        <div className='text-muted text-center'>
                        <span>
                          Toplam məlumat:
                            {' '}
                            {state.results?.totalElements}
                        </span>
                        </div>
                    </div>
                </div>
                }
            </div>
        </React.Fragment>
    )

}
export default Search;

