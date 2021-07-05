import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {get} from "../api/Api";

const Search = (props) => {

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(0);

    const cancelQuery = '';

    const handleOnInputChange = (event) => {
        const query = event.target.value;
        setQuery(query);
        setIsLoading(true);
        if ( query ) {
            fetchSearchResults(page, query);
        }
    };

    console.log(message);

    const fetchSearchResults = (pageNumber, query ) => {
        const searchUrl = `/customers/search?name.contains=${query}&page=${pageNumber}&size=20`;

        if (cancelQuery) {
            cancelQuery.cancel();
        }

         get(searchUrl, {
                cancelToken: cancelQuery.token,
            })
            .then((res) => {
                setResults(res);
                setMessage(res?.content?.length ? '' : 'Axtarışa uyğun nəticə tapılmadı.')
                /*this.setState({
                    results: res.data.hits,
                    message: resultNotFoundMsg,
                    loading: false,
                });*/
            })
            .catch((error) => {
                console.log(error);
                setMessage(error?.response?.data?.message);
                /*if (axios.isCancel(error) || error) {
                    this.setState({
                        loading: false,
                        message: 'Failed to fetch results.Please check network',
                    });
                }*/
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
                {results?.content?.length ?
                    results?.content.map((result) => (
                        <Link to={`user/${result.id}`}
                           className="list-group-item list-group-item-action">{result.name} {result.surname}</Link>
                    ))  :
                    {message}
                }
            </div>
        </React.Fragment>
    )

}
export default Search;