import React, { useState, useEffect } from 'react';
import GenericToExcelButton from '../GenericToExcelButton';

const ClientsTable = (props) => {
    let { dataset, Headers, pageSize } = props;
    console.log(dataset)

    const [ displayDataset, setDisplayDataset ] = useState(dataset);
    const [ pageIndex, setPageIndex ] = useState(0);
    const numPages = Math.ceil(displayDataset.length / pageSize);
    const [ canNextPage, setCanNextPage ] = useState(true);
    const [ canPrevPage, setCanPrevPage ] = useState(false);

    useEffect(() => {
        if (pageIndex === 0) {
            setCanPrevPage(false);
            return;
        }
        if (pageIndex === numPages -1) {
            setCanNextPage(false);
            return;
        }
        setCanPrevPage(true);
        setCanNextPage(true);
    }, [numPages, pageIndex]);

    const fieldNames = Headers.map(col => col.accessor);
    const headers = Headers.map(col => col.header);
    const genPageArray = () => {
        let a = []
        for (let i = 0; i < numPages && i < 10; i++) {
            a.push(i)
        }
        return a;
    }
    const pageArray = genPageArray();

    /* Implemented global search */
    const filterData = (filterWord) => {
        if (filterWord === '') {
            setDisplayDataset(dataset);
        }
        setDisplayDataset(dataset.filter(row => {
            const values = Object.values(row);
            for (let j = 0; j < values.length; j++) {
                if (values[j].toString().trim().includes(filterWord)) {
                    return true;
                }
            }
            return false;
        }));
    }

    return (
        <>
            <input 
                type='text'
                placeholder='Buscar'
                onChange={(event) => filterData(event.target.value.trim())}
            />
            <GenericToExcelButton 
                dataset={displayDataset}
                Headers={Headers}
                sheetName={'Clientes'}
            />
            <table>
                <thead>
                    <tr>
                        {
                            /* Create heders */
                            headers.map(header => (
                                <th key={header}>
                                    {`${header}`}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                        {
                            /* Create table data */
                            displayDataset.slice(pageSize * pageIndex, pageSize * (pageIndex + 1)).map((row, i) => (
                                <tr key={`${Math.floor(Math.random() * 100 + 1)}-${i}`}>
                                    {
                                        fieldNames.map(field => (
                                            <td key={`${Math.floor(Math.random() * 1000 + 1)}-${field}`}>
                                                { `${row[field]}` }
                                            </td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                </tbody>
            </table>
            <div>
                <div>
                        Página {`${pageIndex + 1}`} de {`${numPages}`}
                </div>
                <div>
                    <label
                        onClick={() => setPageIndex(0)}
                        disabled={!canPrevPage}
                    >
                        {'<<'}
                    </label>
                    {
                        pageArray.map(pageIdx => (
                            <label
                                key={`page-button-${pageIdx}`}
                                onClick={() => setPageIndex(pageIdx)}
                            >
                                {`${pageIdx + 1}`}
                            </label>
                        ))
                    }
                    <label
                        onClick={() => setPageIndex(numPages-1)}
                        disabled={!canNextPage}
                    >
                        {'>>'}
                    </label>
                </div>
            </div>
        </>
    );
}

export default ClientsTable;