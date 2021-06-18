import React from 'react';
import { deleteLeaderById } from '../../endpoint/zoneLeaders.methods';
import buttonStyle from './DeleteLeaderButton.module.css'

const DeleteLeaderButton = (props) => {
    const { id, handleElimination } = props;

    const handleClick = async () => {
        const res = await deleteLeaderById(id);
        console.log(res.message);
        handleElimination(id);
    }

    return (
        <button
            onClick={handleClick}
            className={buttonStyle['delete-button']}
        >
            Eliminar
        </button>
    );
}

export default DeleteLeaderButton;