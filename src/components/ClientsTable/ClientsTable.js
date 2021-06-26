import React, { useState, useEffect } from 'react';
import GenericToExcelButton from '../GenericToExcelButton';

const ClientsTable = (props) => {
    let { dataset, Headers, pageSize } = props;

    const [ displayDataset, setDisplayDataset ] = useState(dataset);
    const [ pageIndex, setPageIndex ] = useState(0);
    const numPages = Math.ceil(displayDataset.length / pageSize);
    const [ canNextPage, setCanNextPage ] = useState(true);
    const [ canPrevPage, setCanPrevPage ] = useState(false);
    const [ sortSmallToLarge, setSortSmallToLarge ] = useState(true);
    const [ sortingField, setSortingField ] = useState(null);

    useEffect(() => {
        if (pageIndex === 0) {
            setCanPrevPage(false);
            if (pageIndex === numPages - 1) {
                setCanNextPage(false);
                return;
            }
            setCanNextPage(true);
            return;
        }
        if (pageIndex === numPages - 1) {
            setCanNextPage(false);
            setCanPrevPage(true);
            return;
        }
        setCanPrevPage(true);
        setCanNextPage(true);
    }, [numPages, pageIndex]);

    console.log(canPrevPage);
    console.log(canNextPage);

    const sortData = (field) => {
        setSortingField(field);
        setSortSmallToLarge(!sortSmallToLarge);
        setDisplayDataset(displayDataset
            .sort((obj1, obj2) => {
                if (obj1[field] < obj2[field]) {
                    return sortSmallToLarge ? -1 : 1;
                }
                if (obj1[field] > obj2[field]) {
                    return sortSmallToLarge ? 1 : -1;
                }
                return 0;
            }));
    }

    const fieldNames = Headers.map(col => col.accessor);
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
                            Headers.map(header => (
                                <th key={header.header} onClick={() => sortData(header.accessor)}>
                                    {`${header.header}`}
                                    <span>
                                        {header.accessor === sortingField
                                        ? !sortSmallToLarge
                                            ? ' 🔽'
                                            : ' 🔼'
                                        : ''}
                                    </span>
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
                    <button
                        onClick={() => setPageIndex(0)}
                        disabled={!canPrevPage}
                    >
                        {'<<'}
                    </button>
                    <button
                        onClick={() => setPageIndex(pageIndex-1)}
                        disabled={!canPrevPage}
                    >
                        Anterior
                    </button>
                    {
                        pageArray.map(pageIdx => (
                            <button
                                key={`page-button-${pageIdx}`}
                                onClick={() => setPageIndex(pageIdx)}
                            >
                                {`${pageIdx + 1}`}
                            </button>
                        ))
                    }
                    <button
                        onClick={() => setPageIndex(pageIndex+1)}
                        disabled={!canNextPage}
                    >
                        Siguiente
                    </button>
                    <button
                        onClick={() => setPageIndex(numPages-1)}
                        disabled={!canNextPage}
                    >
                        {'>>'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default ClientsTable;