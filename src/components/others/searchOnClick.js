/*
import React, {useState} from "react";
import {Link} from "react-router-dom";

const SearchOnClick = (props) => {

    const [search, setSearch] = useState('')

    const handleOnInputChange = (event) => {
        setSearch(event.target.value)
    }

    return(
        <div className="input-group w-auto">
            <input
                type="text"
                value={search}
                placeholder='Axtarış'
                className="form-control"
                autoComplete="off"
                onChange={handleOnInputChange}
            />
            <Link to={props.link} type="button" className="btn btn-success">
                <i className="fa fa-search"/>
            </Link>
        </div>
    );
}

export default SearchOnClick;*/
