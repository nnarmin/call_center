import React, {useEffect, useState} from 'react';
import {Card} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import Select from 'react-select';
import {selectStyles} from '../../helpers/selectStyles';
import {get} from "../../api/Api";
import Loader from "react-loader-spinner";
import {NoOptionsMessage} from "../../helpers/NoOptionsMessage";

const PurchaseSearch = () => {
    const history = useHistory();
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [statusType, setStatusTypeList] = useState([]);

    const [searchParameter, setSearchParameter] = useState({
        qty_equals: '',
        qty_greaterThan: '',
        qty_lessThan: '',
        price_greaterThan: '',
        price_lessThan: '',
        type_equals: '',
    });

    useEffect(() => {
        get('/status-types').then((res) => {
            setIsFetchingData(false);
            setStatusTypeList(res?.content?.map((statusType) => ({
                value: statusType.id,
                label: `${statusType.name}`,
            })));
        }).catch((err) => {
            setIsFetchingData(false);
        })
    }, [])

    const handleOnInputChange = (type, event) => {
        if(type==='type_equals'){
            setSearchParameter(prevState => ({
                ...prevState,
                [type]: event.value
            }))
        }else{
            setSearchParameter(prevState => ({
                ...prevState,
                [type]: event.target.value
            }))
        }

    }

    const handleSearch = (type, query) => {
        if(type==='type.equals'){
            history.push({
                pathname: '/purchase-statuses',
                search: `?${type}=${query}&page=0&size=10`
            })
        }else {
            history.push({
                pathname: '/purchase-items',
                search: `?${type}=${query}&page=0&size=10`
            })
        }
    }

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
        <React.Fragment>
            <div className="row mt-3">
                <div className="col-lg-12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Sifarişlər üzrə axtarış</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <div className="input-group w-auto">
                                        <input
                                            type="number"
                                            min="1"
                                            value={searchParameter.qty_equals}
                                            placeholder='Məhsul sayı ( = )'
                                            className="form-control"
                                            autoComplete="off"
                                            onChange={(event) => handleOnInputChange('qty_equals', event)}
                                        />
                                        <button onClick={() => handleSearch('qty.equals', searchParameter.qty_equals)} type="button" className="btn btn-success">
                                            <i className="fa fa-search"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <div className="input-group w-auto">
                                        <input
                                            type="number"
                                            min="1"
                                            value={searchParameter.qty_greaterThan}
                                            placeholder='Məhsul sayı ( böyükdür )'
                                            className="form-control"
                                            autoComplete="off"
                                            onChange={(event) => handleOnInputChange('qty_greaterThan', event)}
                                        />
                                        <button onClick={() => handleSearch('qty.greaterThan', searchParameter.qty_greaterThan)} type="button" className="btn btn-success">
                                            <i className="fa fa-search"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <div className="input-group w-auto">
                                        <input
                                            type="number"
                                            min="1"
                                            value={searchParameter.qty_lessThan}
                                            placeholder='Məhsul sayı ( kiçikdir )'
                                            className="form-control"
                                            autoComplete="off"
                                            onChange={(event) => handleOnInputChange('qty_lessThan', event)}
                                        />
                                        <button onClick={() => handleSearch('qty.lessThan', searchParameter.qty_lessThan)} type="button" className="btn btn-success">
                                            <i className="fa fa-search"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <div className="input-group w-auto">
                                        <input
                                            type="number"
                                            min="1"
                                            value={searchParameter.price_lessThan}
                                            placeholder='Qiymət (kiçikdir)'
                                            className="form-control"
                                            autoComplete="off"
                                            onChange={(event) => handleOnInputChange('price_lessThan', event)}
                                        />
                                        <button onClick={() => handleSearch('price.lessThan', searchParameter.price_lessThan)} type="button" className="btn btn-success">
                                            <i className="fa fa-search"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <div className="input-group w-auto">
                                        <input
                                            type="number"
                                            min="1"
                                            value={searchParameter.price_greaterThan}
                                            placeholder='Qiymət (böyükdür)'
                                            className="form-control"
                                            autoComplete="off"
                                            onChange={(event) => handleOnInputChange('price_greaterThan', event)}
                                        />
                                        <button onClick={() => handleSearch('price.greaterThan', searchParameter.price_greaterThan)} type="button" className="btn btn-success">
                                            <i className="fa fa-search"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <div className="input-group w-auto">
                                        <Select
                                            styles={selectStyles}
                                            options={statusType}
                                            components={(props) => NoOptionsMessage(props, 'Status növü tapılmadı')}
                                            onChange={(event) => handleOnInputChange('type_equals', event)}
                                            placeholder='Status növünü seçin...'
                                        />
                                        <button onClick={() => handleSearch('type.equals', searchParameter.type_equals)} type="button" className="btn btn-success">
                                            <i className="fa fa-search"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );

};

export default PurchaseSearch;
