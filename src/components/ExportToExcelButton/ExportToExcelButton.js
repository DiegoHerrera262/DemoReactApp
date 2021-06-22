import React from 'react';
import buttonStyle from './ExportToExcelButton.module.css';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const ExportToExcelButton = (props) => {
    const { dataset } = props;

    const handleDownloadExcel = () => {
        const excelData = dataset.map(leader => {
            return {
                Id : leader.id,
                Nombre : leader.name,
                Apellido : leader.last_name,
                Zona : leader.zone_id,
                Celular : leader.cellphone,
                Dirección : leader.address
            }
        })
        // convert JSON to sheet
        const leaderSheet = XLSX.utils.json_to_sheet(excelData);
        // outline file
        const outline = {
            Sheets : {'Líderes' : leaderSheet},
            SheetNames : ['Líderes']
        }
        // create excel buffer
        const excelBuffer = XLSX.write(outline, { bookType : 'xlsx', type : 'array' });
        const data = new Blob([excelBuffer], { type : fileType });
        // Download file
        FileSaver.saveAs(data, 'lideres_de_zona.xlsx');
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

export default ExportToExcelButton;