import React from 'react';
import buttonStyle from './ExportToExcelButton.module.css';
import exportFromJSON from 'export-from-json';

const ExportToExcelButton = (props) => {
    const { dataset, fileName, fileType } = props;

    const handleClick = () => {
        exportFromJSON({ dataset, fileName, fileType });
    }


    return (
        <>
            <button
                onClick={handleClick}
                className={buttonStyle['export-button']}
            >
                Generar excel
            </button>
        </>
    );
}

export default ExportToExcelButton;