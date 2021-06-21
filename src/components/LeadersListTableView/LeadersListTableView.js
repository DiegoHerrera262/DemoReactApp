import React, {useState, useEffect, useMemo} from 'react';
import { getLeaders } from '../../endpoint/zoneLeaders.methods';

//import LeadersListTable from '../LeadersListTable/LeadersListTable';
import ListTableLeaders from '../ListTableLeaders';
import listStyles from './LeadersListTableView.module.css'

/*
const headerKeys = [
    'id',
    'name',
    'last_name',
    'zone_id',
    'cellphone',
    'address'
];
*/

const LeadersListTableView = () => {
    const [leadersArray, setLeadersArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLeadersArray(await getLeaders());
            setIsLoading(false);
        }
        fetchData();
    }, [])

    /*
    const data = useMemo(
        () => [
            {
            col1: 'Hello',
            col2: 'World',
            },
            {
            col1: 'react-table',
            col2: 'rocks',
            },
            {
            col1: 'whatever',
            col2: 'you want',
            },
        ],
        []
        )

    const columns = useMemo(
        () => [
            {
            Header: 'Column 1',
            accessor: 'col1', // accessor is the "key" in the data
            },
            {
            Header: 'Column 2',
            accessor: 'col2',
            },
        ],
        []
        )
    */

        
    const headerNames = useMemo(() => [
        {
            Header : 'Id',
            accessor : 'id'
        },
        {
            Header : 'Nombre',
            accessor : 'name'
        },
        {
            Header : 'Apellido',
            accessor : 'last_name'
        },
        {
            Header : 'Zona',
            accessor : 'zone_id'
        },
        {
            Header : 'Celular',
            accessor : 'cellphone'
        },
        {
            Header : 'Dirección',
            accessor : 'address'
        }
    ], []);

    const memoLeadersData = useMemo(() => {
        
        if (leadersArray.length > 0) {
            return leadersArray;
        }
        
        return [
            {
                id : '',
                name : '',
                last_name : '',
                zone_id : '',
                cellphone : '',
                address : ''
            }
        ];
    }, [leadersArray]);

    // For handling ui update after leader elimination
    const handleElimination = (id) => {
        setLeadersArray(leadersArray.filter((leader) => leader.id !== id));
    }

    console.log(leadersArray)
    // console.log(memoLeadersData)
    return (
        <>
            {   !isLoading &&
                <div
                    className={listStyles['container']}
                >
                    <div
                        style={{
                            maxWidth : '91%',
                            marginTop : '1.9em',
                            marginBottom : '1.5em',
                            marginLeft : '1ch',
                            marginRight : 'auto',
                            fontSize : '1.5em',
                            fontWeight : '600'
                        }}
                    >
                        Líderes de zona
                    </div>
                    <ListTableLeaders 
                        leaderData={memoLeadersData}
                        tableColumns={headerNames}
                        handleElimination={handleElimination}
                    />
                </div>
            }
            {
                isLoading && 
                <div className={listStyles['loader']}></div>
            }
        </>
    );
}

export default LeadersListTableView;