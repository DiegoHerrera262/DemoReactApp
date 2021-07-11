import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ClientsTable from '../ClientsTable';
import { Redirect } from 'react-router-dom';
import detailStyles from './ClientsDetailView.module.css'; import { getClientDetailById, getClientByIdSells, getClientByIdMostBought  } from '../../endpoint/clients.methods';
import { GoogleMap, useLoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';
import mapPin from '../assets/pin.png';
import errorImage from '../assets/errorImage.png';

const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;
const StoreMap = (props) => {
    const { mapContainerStyle, zoom, center, markerCoords } = props;
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey : GoogleMapsToken
    });

    if (loadError) {
        return (
            <p align='center'>
                <img src={errorImage}
                    alt=''
                    width='40px'
                    height='40px' 
                />
                Error al cargar el mapa.
            </p>
        );
    }

    if (!isLoaded) {
        return (
            <div className={detailStyles['loading-div']} />
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={zoom}
            center={{
                lat : center.latitude,
                lng : center.longitude
            }}
        >
            <Marker
                position={{ 
                    lat: markerCoords.latitude, 
                    lng : markerCoords.longitude 
                }}
                icon={{
                    url: mapPin,
                    scaledSize : {
                        width : 35,
                        height : 35
                    }
                }}
            />
        </GoogleMap>
    );
}

const RedirectButton = (props) => {
    const { buttonLabel, buttonStyle, path } = props;
    const [ redirect, setRedirect ] = useState(false);
    const handleClick = () => {
        setRedirect(true);
    }

    if (redirect) {
        return <Redirect to={path} />;
    }

    return (
        <button
            onClick={handleClick}
            className={buttonStyle}
        >
            {buttonLabel}
        </button>
    );
}

const TabPane = (props) => {
    // const { className } = props;
    return (
        <>
            { props.children }
        </>
    );
}
TabPane.propTypes = {
    name : PropTypes.string
};

const CustomTabs = (props) => {
    const { children, className } = props;
    // getting headers of tab menu
    const headers = React.Children.map(children, (element) => {
        return element.props.name;
    });
    const [ active, setActive ] = useState(headers.length > 0 ? headers[0] : '');

    const getActiveChild = () => {
        for (const child of children){
            if (child.props.name === active) {
                return child;
            }
        }
        return children[0];
    }
    const activeChild = getActiveChild();

    return (
        <>
            <div className={className['tabs-menu']}>
                {
                    headers.map((header, i) => (
                        <button
                            key={`${header}-${i}`}
                            onClick={(event) => {setActive(header)}}
                            className={header === active ? className['active-tab'] : className['unactive-tab']}
                        >
                            {header}
                        </button>
                    ))
                }
            </div>
            <div className={className['tab-content']}>
                { activeChild }
            </div>
        </>
    );
}
CustomTabs.propTypes = {
    children : (props, propName, componentName) => {
        const prop = props[propName];
        let error = null;
        React.Children.forEach(prop, (child) => {
            if (child.type !== TabPane) {
                error = new Error('Component is not of type TabPane');
            }
        });
        return error;
    }
};


const ClientsDetailView = (props) => {
    const { clientId } = props;
    const [ detailInfo, setDetailInfo ] = useState({});
    const [ sellsInfo, setSellsInfo ] = useState([]);
    const [ boughtInfo, setBoughtInfo ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);

    const sellsInfoHeaders = [
        {
            accessor : 'id',
            header : 'Id',
        },
        {
            accessor : 'sellDate',
            header : 'Fecha'
        },
        {
            accessor : 'value',
            header : 'Valor'
        },
        {
            accessor : 'ticket',
            header : 'Factura'
        },
        {
            accessor : 'state',
            header: 'Estado'
        }
    ];

    const boughtInfoHeaders = [
        {
            accessor : 'id',
            header : 'Id',
        },
        {
            accessor : 'name',
            header : 'Nombre Prod.'
        },
        {
            accessor : 'category',
            header : 'Categoria'
        },
        {
            accessor : 'quantity',
            header : 'Cantidad'
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            setDetailInfo(await getClientDetailById(clientId));
            setSellsInfo(await getClientByIdSells(clientId));
            setBoughtInfo(await getClientByIdMostBought(clientId));
            setIsLoading(false);
        }
        fetchData();
    },[clientId]);

    if (isLoading) {
        return (
            <div className={detailStyles['loading-div']}></div>
        );
    }
    console.log(sellsInfo);
    console.log(boughtInfo);

    return (
        <div className={detailStyles['view-container']}>
            <h2>Detalle Cliente</h2>
            <div className={detailStyles['view-wrapper']}>
                <div className={detailStyles['detail-col']}>
                    <div className={detailStyles['banner-div']}></div>
                    <div className={detailStyles['detail-wrapper']}>
                        <div className={detailStyles['basic-info-col']}>
                            <div className={detailStyles['name-banner']}>
                                {`${detailInfo['basicInfo']['name'].toUpperCase()}`}
                            </div>
                            <div className={detailStyles['basic-info-content']}>
                                <p> {`${detailInfo['basicInfo']['storeAddress']}`} </p>
                                <p> {`${detailInfo['basicInfo']['locality']}`} </p>
                                <p> {`${detailInfo['basicInfo']['cellphone']}`} </p>
                                <p> {`${detailInfo['basicInfo']['email']}`} </p>
                                <p> {`Creado ${detailInfo['basicInfo']['createdAt']}`} </p>
                            </div>
                        </div>
                        <div className={detailStyles['sells-col']}>
                            <label className={detailStyles['client-type-label']}> 
                                {`${detailInfo['sellingInfo']['clientType'].toUpperCase()}`} 
                            </label>
                            <label className={detailStyles['client-level-label']}> 
                                {`Nivel: ${detailInfo['sellingInfo']['clientLevel']}`} 
                            </label>
                            <div className={detailStyles['delivered-info-div']}>
                                <p>ENTREGADOS: <span className={detailStyles['indicator']}>{`${detailInfo['sellingInfo']['deliveredReq']['number']}`}</span></p>
                                <p>Valor: <span className={detailStyles['indicator']}>{`${detailInfo['sellingInfo']['deliveredReq']['totalValue']}`}</span></p>
                            </div>
                            <div className={detailStyles['returned-total-div']}>
                                DEVUELTOS: <span className={detailStyles['indicator']}>{`${detailInfo['sellingInfo']['returns']['number']}`}</span>
                            </div>
                            <div className={detailStyles['returned-percent-div']}>
                                % DEVOLUCIÓN: <span className={detailStyles['indicator']}>{`${detailInfo['sellingInfo']['returns']['percent']}`}</span>
                            </div>
                        </div>
                    </div>
                    <RedirectButton
                        buttonLabel='Gestión'
                        buttonStyle={detailStyles['manage-button']}
                        path='/' 
                    />
                    <RedirectButton
                        buttonLabel='Nuevo pedido'
                        buttonStyle={detailStyles['order-button']}
                        path='/clients/create' 
                    />
                </div>
                <div className={detailStyles['table-col']}>
                    <CustomTabs className={detailStyles}>
                        <TabPane name='Pedidos'>
                            <ClientsTable
                                dataset={sellsInfo}
                                Headers={sellsInfoHeaders}
                                downloadFileName={`OrdenesCliente-${clientId}`}
                                pageSize={2}
                                identifier={'id'}
                            />
                        </TabPane>
                        <TabPane name='Más Comprados'>
                            <ClientsTable
                                dataset={boughtInfo}
                                Headers={boughtInfoHeaders}
                                downloadFileName={`MasVendidosCliente-${clientId}`}
                                pageSize={3}
                                identifier={'id'}
                            />
                        </TabPane>
                        <TabPane name='Ubicación'>
                            <StoreMap
                                mapContainerStyle={{
                                    width: '100%',
                                    height: '300px'
                                }}
                                zoom={11}
                                center={{
                                    latitude : detailInfo['basicInfo']['coordinates'].latitude,
                                    longitude : detailInfo['basicInfo']['coordinates'].longitude
                                }}
                                markerCoords={{
                                    latitude : detailInfo['basicInfo']['coordinates'].latitude,
                                    longitude : detailInfo['basicInfo']['coordinates'].longitude
                                }}
                            />
                        </TabPane>
                    </CustomTabs>
                </div>
            </div>
        </div>
    );
}

export default ClientsDetailView; 
