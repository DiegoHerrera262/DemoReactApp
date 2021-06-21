import React from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import DeleteLeaderButton from '../DeleteLeaderButton';
import UpdateLeaderButton from '../UpdateLeaderButton';
import CreateLeaderButton from '../CreateLeaderButton';
import tableStyles from './ListTableLeaders.module.css';

const ListTableLeaders = (props) => {
    const { leaderData, tableColumns, handleElimination } = props;
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
        state,
        page,

        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter }
    } = useTable({
        data : leaderData, 
        columns : tableColumns,
        initialState : {pageIndex : 0, pageSize : 10}
    }, useGlobalFilter, usePagination);

    const GenPageNumberButtonArray = () => {
        let a = [];
        for (let j = 0; j < pageCount && j < 10; j++) {
            a.push(j);
        }
        return a;
    }

    const pageButtonsArray = GenPageNumberButtonArray();

    return (
        <>
            <div className={tableStyles['search-line']}>
                <div className={tableStyles['search-line-col1']}>
                    <input
                        type='text'
                        placeholder='Buscar'
                        value={globalFilter || ''}
                        className={tableStyles['search-input']}
                        onChange={event => setGlobalFilter(event.target.value)}
                    />
                </div>
                <div className={tableStyles['search-line-col2']}>
                    <CreateLeaderButton />
                </div>
            </div>

            <div
                className={tableStyles['info-title']}
            >
                Líderes de zona
            </div>
            
            <table 
                {...getTableProps()}
            >
                <thead>
                    {
                        headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>
                                            {column.render('Header')}
                                        </th>
                                        )
                                    )
                                }
                                <th>
                                    Acciones
                                </th>
                            </tr>
                            )
                        )
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        page.map((row, i) => {
                            console.log(row.cells[0].value)
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map(cell => {
                                            return (
                                                <td {...cell.getCellProps()}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })
                                    }
                                    <td>
                                            <UpdateLeaderButton
                                                id={row.cells[0].value}
                                            />
                                            <span className={tableStyles['button-separator']}>  </span>
                                            <DeleteLeaderButton
                                                id={row.cells[0].value}
                                                handleElimination={handleElimination}
                                            />
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            <div className={tableStyles['table-footer']}>
                <div className={tableStyles['table-footer-col1']}>
                    Página <span>{pageIndex + 1}</span> de <span>{pageOptions.length}</span>
                </div>
                <div className={tableStyles['table-footer-col2']}>    
                    <label
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                        className={tableStyles['prev']}
                    >
                        Comienzo
                    </label>
                    <label
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        className={tableStyles['prev']}
                    >
                        Anterior
                    </label>

                    {
                        pageButtonsArray.map((pageNum) => {
                            return (
                                <label
                                    key={pageNum}
                                    onClick={() => gotoPage(pageNum)}
                                    className={tableStyles['page']}
                                >
                                    {pageNum + 1}
                                </label>
                            );
                        })
                    }
                    
                    <label
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                        className={tableStyles['next']}
                    >
                        Siguiente
                    </label>
                    <label
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                        className={tableStyles['next']}
                    >
                        Fin
                    </label>
                </div>
            </div>
        </>
    );
}

export default ListTableLeaders;