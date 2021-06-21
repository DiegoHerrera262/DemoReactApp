import React, { useState } from 'react';
import buttonStyle from './CreateLeaderButton.module.css'
import { Redirect } from 'react-router-dom';

const UpdateLeaderButton = (props) => {
    const [redirect, setRedirect] = useState(false);

    const handleClick = () => {
        setRedirect(true);
    }


    return (
        <>
            <button
                onClick={handleClick}
                className={buttonStyle['create-button']}
            >
                Crear
            </button>
            {
                redirect && 
                <Redirect to='/leaders/create' />
            }
        </>
    );
}

export default UpdateLeaderButton;