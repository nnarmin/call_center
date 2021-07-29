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
    const [activeTab, setActiveTab] = useState('info');

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
                    <Tab eventKey="info" title="Sifariş Məhsulu" disabled={type==="info" ? false : isDisabled}>
                        <PurchaseItem/>
                    </Tab>
                    <Tab eventKey="note" title="Sifariş Qeydləri" disabled={type==="note" ? false : isDisabled}>
                        <PurchaseNote/>
                    </Tab>
                    <Tab eventKey="status" title="Sifariş Statusu" disabled={type==="status" ? false : isDisabled}>
                        <PurchaseStatus/>
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    )
}

export default PurchaseAddEdit;

