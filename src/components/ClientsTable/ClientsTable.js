import React, { useState, useEffect, useMemo } from 'react';
import GenericToExcelButton from '../GenericToExcelButton';
import tableStyles from './ClientsTable.module.css';

const ClientsTable = (props) => {
    let { dataset, Headers, pageSize, actions, identifier, downloadFileName } = props;

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

    useMemo(() => {
        if (sortingField){
            setDisplayDataset(displayDataset
                .sort((obj1, obj2) => {
                    if (obj1[sortingField] < obj2[sortingField]) {
                        return sortSmallToLarge ? -1 : 1;
                    }
                    if (obj1[sortingField] > obj2[sortingField]) {
                        return sortSmallToLarge ? 1 : -1;
                    }
                    return 0;
                }));
        }
    }, [sortingField, displayDataset, sortSmallToLarge])

    const sortData = (field) => {
        setSortingField(field);
        if (field !== sortingField) {
            setSortSmallToLarge(true);    
        }
        if (field === sortingField) {
            setSortSmallToLarge(!sortSmallToLarge);
        }
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
        setPageIndex(0);
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
            <div className={tableStyles['search-bar']}>
                <div className={tableStyles['input-div']}>
                    <input 
                        type='text'
                        placeholder='Buscar'
                        onChange={(event) => filterData(event.target.value.trim())}
                        className={tableStyles['search-input']}
                    />
                </div>
                <div className={tableStyles['button-div']}>
                    <GenericToExcelButton 
                        dataset={displayDataset}
                        Headers={Headers}
                        sheetName={downloadFileName}
                    />
                </div>
            </div>
            <div
                className={tableStyles['table-container']}
            >
                <table className={tableStyles['clients-table']}>
                    <thead>
                        <tr>
                            {
                                /* Create heders */
                                Headers.map(header => (
                                    <th 
                                        key={header.header} 
                                        onClick={() => sortData(header.accessor)}
                                        className={tableStyles['clients-th']}
                                    >
                                        {`${header.header}`}
                                        <span>
                                            {header.accessor === sortingField
                                            ? sortSmallToLarge
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                        </span>
                                    </th>
                                ))
                            }
                            {
                                actions && (
                                    <th className={tableStyles['clients-th']}>
                                        Acciones
                                    </th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                            {
                                /* Create table data */
                                displayDataset.slice(pageSize * pageIndex, pageSize * (pageIndex + 1)).map((row, i) => (
                                    <tr key={`${Math.floor(Math.random() * 100 + 1)}-${i}`}>
                                        {
                                            <>
                                                {
                                                    fieldNames.map(field => (
                                                        <td key={`${Math.floor(Math.random() * 1000 + 1)}-${field}`}>
                                                            { `${row[field]}` }
                                                        </td>
                                                    ))
                                                }
                                                { actions && (
                                                        <td>
                                                            {
                                                                actions.map(action => (
                                                                    <action.Component 
                                                                        key={`${Math.floor(Math.random() * 100000 + 1)}`} 
                                                                        {...action.props}
                                                                        id={row[identifier]}
                                                                    />
                                                                ))
                                                            }
                                                        </td>
                                                    )
                                                }
                                            </>
                                        }
                                    </tr>
                                ))
                            }
                    </tbody>
                </table>
            </div>
            <div className={tableStyles['clients-pag']}>
                <div className={tableStyles['page-index']}>
                        Pág. {`${pageIndex + 1}`} de {`${numPages}`}
                </div>
                <div className={tableStyles['page-buttons']}>
                    <button
                        onClick={() => setPageIndex(0)}
                        disabled={!canPrevPage}
                        className={tableStyles['prev']}
                    >
                        {'<<'}
                    </button>
                    <button
                        onClick={() => setPageIndex(pageIndex-1)}
                        disabled={!canPrevPage}
                        className={tableStyles['prev']}
                    >
                        ANTERIOR
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
                        className={tableStyles['next']}
                    >
                        SIGUIENTE
                    </button>
                    <button
                        onClick={() => setPageIndex(numPages-1)}
                        disabled={!canNextPage}
                        className={tableStyles['next']}
                    >
                        {'>>'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default ClientsTable;