import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const InfoModal = ({
    visible, onConfirm, onCancel, title, body, onClose, error, isLoading,
})=> (

    <Modal
        show={visible}
        onHide={onClose}
        aria-labelledby='contained-modal-title-vcenter'
        centered
    >
        <Modal.Header>
            <Modal.Title id='contained-modal-title-vcenter'>
                {title}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {error && (<p>{error}</p>)}
            <p>{body}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button
                type='button'
                variant='secondary'
                onClick={onCancel}
                disabled={isLoading}
            >
                Bağla
            </Button>
            <Button
                type='button'
                variant='danger'
                onClick={onConfirm}
                disabled={isLoading}
            >
                Sil
            </Button>
        </Modal.Footer>
    </Modal>
);

InfoModal.defaultProps = {
    title: 'Əminsiniz?',
    error: '',
};

export default InfoModal;
