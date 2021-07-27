import React from 'react'
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmation = ({ showModal, hideModal, confirmModal, id, type, index, message }) => {
    return (
        <Modal show={showModal} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Silinmə</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="default" onClick={hideModal}>
                    Ləğv et
                </Button>
                <Button variant="danger" onClick={() => confirmModal(index, type, id) }>
                    Sil
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteConfirmation;