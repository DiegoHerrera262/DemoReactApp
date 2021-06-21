import React, { useState } from 'react';
import { deleteLeaderById } from '../../endpoint/zoneLeaders.methods';
import buttonStyle from './DeleteLeaderButton.module.css';
import Modal from 'react-modal';
Modal.setAppElement('body');

const DeleteLeaderButton = (props) => {
    const { id, handleElimination } = props;
    const [ confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const handleValidateDelete = () => {
        setConfirmDeleteModal(true);
    }

    const handleClick = async () => {
        const res = await deleteLeaderById(id);
        console.log(res.message);
        handleElimination(id);
        setConfirmDeleteModal(false);
    }

    return (
        <>
            <button
                onClick={handleValidateDelete}
                className={buttonStyle['delete-button']}
            >
                Eliminar
            </button>
            <Modal 
                isOpen={confirmDeleteModal}
                onRequestClose={() => setConfirmDeleteModal(false)}
                className={buttonStyle['Modal']}
                overlayClassName={buttonStyle['Overlay']}
            >
                <p align='center'>
                    Confirme eliminación del líder.
                </p>
                <div
                    style={{textAlign : 'center'}}
                >
                    <button 
                        onClick={handleClick}
                        className={buttonStyle['delete-button']}
                    >
                        Eliminar
                    </button>
                </div>
            </Modal>
        </>
        
    );
}

export default DeleteLeaderButton;