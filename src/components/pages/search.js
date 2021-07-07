import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {get} from "../api/Api";
import axios from "axios";

const Search = (props) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(0);
    let token;

    const handleOnInputChange = (event) => {
        const query = event.target.value;
        setQuery(query);
        setIsLoading(true);
        if (query.trim().length) {
            fetchSearchResults(page, query);
        } else {
            console.log(query.trim().length);
            console.log("0000");
            setResults([]);
            setMessage('0000');
        }
    };

    const fetchSearchResults = (pageNumber, query) => {
        if (token) {
            // Cancel the previous request before making a new request
            token.cancel()
        }
        // Create a new CancelToken
        token = axios.CancelToken.source();
        const searchUrl = `${props.search_url}=${query}&page=${pageNumber}&size=20`;
        setIsLoading(true);

        get(searchUrl, {
            cancelToken: token.token
        }).then((res) => {
            setResults(res);
            const messageInfo = res?.content?.length ? '' : 'Axtarışa uyğun nəticə tapılmadı.';
            setIsLoading(false);
            setMessage(messageInfo);
        }).catch((error) => {
            if (axios.isCancel(error) || error) {
                setIsLoading(false);
                const messageInfo = error?.response?.data?.message
                setMessage(messageInfo);
            }
        });
    };

    return (
        <React.Fragment>
            <div className="form-group position-relative">
                <label className="search-label">{props.label}</label>
                <input
                    type="text"
                    value={query}
                    placeholder={props.placeholder}
                    className="form-control"
                    autoComplete="off"
                    onChange={handleOnInputChange}
                />
                <i className="fa fa-search search-icon"/>
            </div>
            <div className="search-result">
                {results?.content && results?.content?.map((result) => (
                    <Link to={`user/${result.id}`}
                          className="list-group-item list-group-item-action"
                          key={result.id}>{result.name} {result.surname}</Link>
                ))
                }

                {message}

                {console.log(results)};

                {/*<div className='row pt-2'>
                    <div className='col-md-4'>
                        <nav aria-label='Page navigation example p-0'>
                            <ul className='pagination mb-0'>
                                <li className={`page-item ${results?.first ? 'disabled' : ''}`}>
                                    <button onClick={setPage(() => page - 1)} type='button' className='page-link'>
                                        Əvvəlki
                                    </button>
                                </li>
                                {Array.from(Array(results?.totalPages).keys()).map((num) => (
                                    <li key={num} className={`page-item ${results?.number === num ? 'active' : ''}`}>
                                        <button onClick={setPage(() => num)} type='button'
                                                className='page-link'>{+num + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${results?.last ? 'disabled' : ''}`}>
                                    <button onClick={setPage(() => page + 1)} type='button' className='page-link'>
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
                            {results?.totalElements}
                        </span>
                        </div>
                    </div>
                </div>*/}
            </div>
        </React.Fragment>
    )

}
export default Search;