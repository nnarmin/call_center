import React, {useEffect, useState} from 'react';
import {useQuery} from "../../hooks/useQuery";
import {Card, Tabs, Tab} from "react-bootstrap";
import PurchaseItem from "./PurchaseItem";
import PurchaseNote from "./PurchaseNote";
import PurchaseStatus from "./PurchaseStatus";

const PurchaseAddEdit = () => {
    let query = useQuery();
    const type = query.get('type');
    const isEditable = query.get('edit');
    const [isDisabled, setIsDisabled] = useState(true);
    const [activeTab, setActiveTab] = useState('purchaseInfo');

    useEffect(() => {
        alert(type)
        if(isEditable && type){
            setActiveTab(type);
            console.log(activeTab)
        }
    }, [isEditable, type]);

    return (
        <Card>
            <Card.Body>
                <Tabs defaultActiveKey={activeTab} className="mb-3">
                    <Tab eventKey="purchaseInfo" title="Sifariş Məhsulu">
                        <PurchaseItem/>
                    </Tab>
                    <Tab eventKey="note" title="Sifariş Qeydləri">
                        <PurchaseNote/>
                    </Tab>
                    <Tab eventKey="status" title="Sifariş Statusu">
                        <PurchaseStatus/>
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    )
}

export default PurchaseAddEdit;

