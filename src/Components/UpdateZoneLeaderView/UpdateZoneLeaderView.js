import React, { useState, useEffect } from 'react';
import UpdateZoneLeaderForm from '../UpdateZoneLeaderForm';
import { getLeaderById } from '../../endpoint/zoneLeaders.methods';
import updateStyles from './UpdateZoneLeaderView.module.css';

// Keys for labeling inputs
const labelKeys = {
    name : 'Nombre',
    lastName : 'Apellido',
    documentId : 'Documento de identidad',
    zone : 'Zona',
    address : 'Dirección',
    leaderCode : 'Código de líder',
    email : 'Email',
    cellphone : 'Número celular',
    endContractDate : 'Fecha fin de contrato',
}

const typeKeys = {
    name : 'text',
    lastName : 'text',
    documentId : 'number',
    zone : 'select',
    address : 'text',
    leaderCode : 'number',
    email : 'email',
    cellphone : 'number',
    endContractDate : 'date',
}

const selectValues = {
    zone : [
      '--Elija una zona--',
      'Norte',
      'Sur'
    ]
}

const UpdateZoneLeaderView = (props) => {
    const { leaderId } = props;
    const [defaultInitialValues, setDefaultInitialValues] = useState({
        name : '',
        lastName : '',
        documentId : '',
        zone : '',
        address : '',
        leaderCode : '',
        email : '',
        cellphone : '',
        endContractDate : '',
        frontID : {},
        rut : {},
        bankData : {},
        contract : {}, 
        profileImage : ''
    })
    const [loadingData, setLoadingData] = useState(true);

    
    useEffect(() =>{
        const fetchData = async (id) =>  {
            const result = await getLeaderById(id);
            const resData = result[0];
            console.log(resData);
            setDefaultInitialValues({
                name: resData['name'],
                lastName: resData['last_name'],
                documentId : parseInt(resData['document']),
                zone : '',
                address : resData['address'],
                leaderCode : parseInt(resData['seller_code']),
                email : '',
                cellphone : parseInt(resData['cellphone']),
                endContractDate : new Date(Date.parse(resData['contract_expires'])).toISOString().substring(0,10)
            });
            setLoadingData(false);
        }
        fetchData(leaderId);
    }, [leaderId]);
    
    return (
        
        <>
            {
                loadingData && 
                <div className={updateStyles['loader']}></div>
            }
            {
                !loadingData && 
                <div className={updateStyles['main-page-container']}>
                    <div
                        style={{
                            maxWidth : '91%',
                            marginTop : '1.9em',
                            marginBottom : '2.1em',
                            marginLeft : 'auto',
                            marginRight : 'auto',
                            fontSize : '1.5em',
                            fontWeight : '600'
                        }}
                    >
                        Editar datos líder de zona
                    </div>
                    <div className={updateStyles['info-title']}>
                        Información general
                    </div>
                    <UpdateZoneLeaderForm
                        defaultInitialValues={defaultInitialValues}
                        leaderId={props.leaderId}
                        labelKeys={labelKeys}
                        typeKeys={typeKeys}
                        selectValues={selectValues}
                    />
                </div>
            }
        </>

    );
}

export default UpdateZoneLeaderView;