import React from 'react';
import buttonStyle from './CreateLeaderButton.module.css'

const UpdateLeaderButton = (props) => {

    const handleClick = () => {
        alert('Crear lider')
        /*
        HERE CALL THE ROUTE
        */
    }

    return (
        <button
            onClick={handleClick}
            className={buttonStyle['create-button']}
        >
            Crear líder
        </button>
    );
}

export default UpdateLeaderButton;