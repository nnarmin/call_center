import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import {useQuery} from '../../hooks/useQuery';
import {get} from '../../api/Api';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import {Card} from "react-bootstrap";

const TemplateDetail = () => {
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();
    const query = useQuery();
    const purchaseId = query.get('id');
    const [purchaseItem, setPurchaseItem] = useState([]);
    const [purchaseNote, setPurchaseNote] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState([]);

    useEffect(() => {
        get(`/purchase-items/search?purchaseId.equals=${purchaseId}&page=0&size=10`)
            .then((res) => {
                setPurchaseItem(res.content);
            }).catch(console.log);

        get(`/purchase-notes/search?purchaseId.equals=${purchaseId}&page=0&size=10`)
            .then((res) => {
                setPurchaseNote(res.content);
            }).catch(console.log);

        get(`/purchase-statuses/search?purchaseId.equals=${purchaseId}&page=0&size=10`)
            .then((res) => {
                setPurchaseStatus(res.content)
            })
            .catch(console.log);
        setIsLoading(false);
    }, [history, purchaseId]);

    const deleteHandle = () => {

    }

    return (
        <Card style={{minHeight: 300}}>
            <Card.Header className='my-3'>
                <div className='row'>
                    <h5 className="mb-0">Sifariş Məlumatları</h5>
                </div>
            </Card.Header>
            <Card.Body>
                {isLoading
                    ? (
                        <div className='display-absolute-center'>
                            <Loader
                                type="ThreeDots"
                                color="#00BFFF"
                                height={60}
                                width={60}/>
                        </div>
                    )
                    : (
                        <Tabs>
                            <TabList>
                                <Tab>Sifarişlər</Tab>
                                <Tab>Qeydlər</Tab>
                                <Tab>Status</Tab>
                            </TabList>
                            <TabPanel>
                                {purchaseItem.length ?
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover mb-0">
                                            <thead className="library-table-head">
                                            <tr>
                                                <th className="library-table-index" scope="col">#</th>
                                                <th scope="col">Sifariş adı</th>
                                                <th scope="col">Ödəniş növü</th>
                                                <th scope="col">Qiymət</th>
                                                <th scope="col">Say</th>
                                                <th scope="col"></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {purchaseItem.map(({
                                                                   id,
                                                                   item,
                                                                   paymentType,
                                                                   qty,
                                                                   price
                                                               }, k) => {
                                                return (
                                                    <tr key={k + 1}>
                                                        <td className="table-index width-25">{k + 1}</td>
                                                        <td>{item}</td>
                                                        <td>{paymentType.name}</td>
                                                        <td>{price}</td>
                                                        <td>{qty}</td>
                                                        <td className="table-actions text-right">
                                                            <Link
                                                                className='mr-3 btn-xs'
                                                                to={`/purchase/add?edit=true&type=info&id=${id}`}
                                                            >
                                                                <i className='fas fa-edit fa-sm text-success'/>
                                                            </Link>
                                                            <span className='ml-2 btn-xs delete-button'
                                                                  onClick={deleteHandle.bind(this, id)}>
                                                                    <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                                </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                    : <p className="text-center">Sifariş məhsulları daxil edilməyib.</p>}
                            </TabPanel>
                            <TabPanel>
                                {purchaseNote.length ?
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover mb-0">
                                            <thead className="library-table-head">
                                            <tr>
                                                <th className="library-table-index" scope="col">#</th>
                                                <th scope="col">Qeyd</th>
                                                <th scope="col"></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {purchaseNote.map(({id, note}, k) => {
                                                return (
                                                    <tr key={k}>
                                                        <td className="table-index width-25">{k}</td>
                                                        <td className="d-flex justify-content-between">
                                                            <span>{note}</span>
                                                        </td>
                                                        <td className="table-actions text-right">
                                                            <Link
                                                                className='mr-3 btn-xs'
                                                                to={`/purchase/add?edit=true&type=note&id=${id}`}
                                                            >
                                                                <i className='fas fa-edit fa-sm text-success'/>
                                                            </Link>
                                                            <span className='ml-2 btn-xs delete-button'
                                                                  onClick={deleteHandle.bind(this, id)}>
                                                                    <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                                </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                    : <p className="text-center">Sifariş qeydi daxil edilməyib.</p>}
                            </TabPanel>
                            <TabPanel>
                                {purchaseStatus.length ?
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover mb-0">
                                            <thead className="library-table-head">
                                            <tr>
                                                <th className="library-table-index" scope="col">#</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Qeyd</th>
                                                <th scope="col"></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {purchaseStatus.map(({id, note, statusType}, k) => {
                                                return (
                                                    <tr key={k + 1}>
                                                        <td className="table-index width-25">{k + 1}</td>
                                                        <td>{statusType.name}</td>
                                                        <td>{note}</td>
                                                        <td className="table-actions text-right">
                                                            <Link
                                                                className='mr-3 btn-xs'
                                                                to={`/purchase/add?edit=true&type=status&id=${id}`}
                                                            >
                                                                <i className='fas fa-edit fa-sm text-success'/>
                                                            </Link>
                                                            <span className='ml-2 btn-xs delete-button'
                                                                  onClick={deleteHandle.bind(this, id)}>
                                                                    <i className="fas fa-trash-alt fa-sm text-danger"/>
                                                                </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                    : <p className="text-center">Sifariş statusu daxil edilməyib.</p>}
                            </TabPanel>
                        </Tabs>
                    )}
            </Card.Body>
        </Card>
    );
};

export default TemplateDetail;
