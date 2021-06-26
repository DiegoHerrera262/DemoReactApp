import React from 'react';
import buttonStyle from './GenericToExcelButton.module.css';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import _ from 'underscore';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const GenericExportToExcelButton = (props) => {
    const { dataset, Headers, sheetName } = props;

    const handleDownloadExcel = () => {
        const excelData = dataset.map(leader => {
            return _.object(Headers.map(header => [
                header.header , leader[header.accessor]
            ]))
        })
        console.log(excelData)
        // convert JSON to sheet
        const sheet = XLSX.utils.json_to_sheet(excelData);
        // outline file
        const outline = {
            Sheets : {'Hoja' : sheet},
            SheetNames : ['Hoja']
        }
        // create excel buffer
        const excelBuffer = XLSX.write(outline, { bookType : 'xlsx', type : 'array' });
        const data = new Blob([excelBuffer], { type : fileType });
        // Download file
        FileSaver.saveAs(data, `${sheetName}.xlsx`);
    }

    return (
        <button
            className={buttonStyle['export-button']}
            onClick={handleDownloadExcel}
        >
            Generar excel
        </button>
    );
}

export default GenericExportToExcelButton;