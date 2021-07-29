import React, {useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {get, post, put} from "../../api/Api";
import {useQuery} from "../../hooks/useQuery";
import Loader from "react-loader-spinner";
import {selectStyles} from "../../helpers/selectStyles";
import {NoOptionsMessage} from "../../helpers/NoOptionsMessage";
import Select from "react-select";
import DeleteConfirmation from "../../components/ConfirmationModal";

const PurchaseStatus = () => {
    const query = useQuery();
    const purchase_id = query.get("purchase_id");
    const type = query.get("type");
    const item_id = query.get("id");
    const isEditable = query.get("edit");
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [statusTypeList, setStatusTypeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState([{
            "purchase": {
                "createdBy": '',
                "createdAt": '',
                "modifiedBy": '',
                "modifiedAt": '',
                "id": purchase_id
            },
            "note": "",
            "statusType": {
                "id": '',
                'name': ''
            },
            'id': ''
        }]
    )

    useEffect(() => {
        get('/status-types').then((res) => {
            setIsFetchingData(false);
            setStatusTypeList(res?.content?.map((statusType) => ({
                value: statusType.id,
                label: `${statusType.name}`,
            })));
        }).catch((err) => {
            setIsFetchingData(false);
        });

        if(isEditable && type==="status"){
            getData();
        }

    }, []);

    const getData = () => {
        get(`/purchase-statuses/${item_id}`).then((res) => {
            setPurchaseStatus([res]);
            setIsFetchingData(false);
        }).catch(() => {
            setIsFetchingData(false);
        })
    }

    const handleInputChange = (i, type, value) => {
        let alldata = [...purchaseStatus];
        if (type === 'select_status_type') {
            alldata[i] = {
                ...alldata[i],
                statusType: {
                    id: value.value,
                    name: value.label
                }
            }
        } else {
            alldata[i] = {
                ...alldata[i],
                [type]: value
            }
        }
        setPurchaseStatus(alldata);
    }

    const showDeleteModal = (key, type, id) => {
        setDeleteMessage(`Məlumatı silmək istədiyinizdən əminsiniz?`);
        setDisplayConfirmationModal(true);
    };

    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    const deletePurchaseItemHandler = () => {

    }

    const onUpdateHandler = (index, event) => {
        event.preventDefault();
        setIsLoading(true);
        if(isEditable){
            put(`/purchase-statuses/${item_id}`, purchaseStatus[index]).then((res) => {
                setIsLoading(false);
            }).catch(err => {
                setIsLoading(false);
            })
        }else{
            post('/purchase-statuses', purchaseStatus[index]).then((res) => {
                setIsLoading(false);
            }).catch(err => {
                setIsLoading(false);
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
        <div>
            <ul className="list-group">
                {purchaseStatus.length && purchaseStatus.map((item, i) => (
                    <li className="list-group-item" key={i}>
                        <div className="row">
                            <div className="col-lg-4">
                                <Select
                                    styles={selectStyles}
                                    options={statusTypeList}
                                    value ={item?.statusType ? [{ value: item?.statusType?.id, label: item?.statusType?.name }] : ''}
                                    components={(props) => NoOptionsMessage(props, 'Sosial Şəbəkə növü tapılmadı')}
                                    onChange={value => handleInputChange(i, "select_status_type", value)}
                                    placeholder='Status növünü seçin...'
                                />
                            </div>
                            <div className="col-lg-4">
                                <input type="text" className="form-control"
                                       placeholder="Status Qeydi"
                                       onChange={(e) => handleInputChange(i, 'note', e.target.value)} value={item.note}
                                />
                            </div>
                            <div className="col-lg-1 d-flex align-items-center">
                                    <span className="mr-3 text-danger delete-button"
                                          onClick={deletePurchaseItemHandler}>
                                            <i className="fas fa-trash-alt fa-sm"/>
                                    </span>
                                    <span data-toggle="tooltip" title={!isEditable ? 'Əlavə et' : 'Düzəlişi təsdiqlə'}
                                      onClick={onUpdateHandler.bind(this, i)}>
                                        <i className="fas fa-check-circle text-success ml-2"/>
                                    </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {!isEditable && <div className="d-flex justify-content-end align-items-center mt-3">
                <Button type="button"
                        variant="success"
                        className="mr-2"
                >
                    Yeni Status əlavə edin
                </Button>
            </div> }
            <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={deletePurchaseItemHandler} hideModal={hideConfirmationModal} type={type} id={item_id} index="0" message={deleteMessage}  />
        </div>
    )
}

export default PurchaseStatus;