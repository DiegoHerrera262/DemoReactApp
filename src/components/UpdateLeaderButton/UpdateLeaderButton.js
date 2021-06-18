import React from 'react';
import buttonStyle from './UpdateLeaderButton.module.css'

const UpdateLeaderButton = (props) => {
    const { id } = props;

    const handleClick = () => {
        alert('Editar lider')
        /*
        HERE CALL THE ROUTE
        */
    }

    return (
        <button
            onClick={handleClick}
            className={buttonStyle['update-button']}
        >
            Editar
        </button>
    );
}

export default UpdateLeaderButton;