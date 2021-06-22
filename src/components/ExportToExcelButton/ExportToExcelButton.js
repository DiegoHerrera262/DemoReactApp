import React from 'react';
import buttonStyle from './ExportToExcelButton.module.css';
import exportFromJSON from 'export-from-json';

const ExportToExcelButton = (props) => {
    const { dataset, fileName} = props;

    const handleClick = () => {
        if (dataset) {
            const exportType = exportFromJSON.types.xls;
            exportFromJSON({ dataset, fileName, exportType });
        }
        
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