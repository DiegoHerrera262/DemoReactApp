import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ClientsTable from '../ClientsTable';
import { Redirect } from 'react-router-dom';
import detailStyles from './ClientsDetailView.module.css';
import { getClientDetailById, getClientByIdSells, getClientByIdMostBought  } from '../../endpoint/clients.methods';

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
    return (
        <div className={detailStyles['tab-pane']}>
            { props.children }
        </div>
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
    console.log(children);
    return (
        <div>
            {children}
        </div>
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
                    <CustomTabs>
                        <TabPane name='Pedidos'>
                            Pedidos
                        </TabPane>
                        <TabPane name='Más Comprados'>
                            Más Comprados
                        </TabPane>
                        <TabPane name='Ubicación'>
                            Ubicación
                        </TabPane>
                        <TabPane name='Notificación push'>
                            Ubicación
                        </TabPane>
                        <TabPane name='Notificación SMS'>
                            Notificación SMS
                        </TabPane>
                        <TabPane name='Contacto WhatsApp'>
                            Contacto Whatsapp
                        </TabPane>
                    </CustomTabs>
                </div>
            </div>
        </div>
    );
}

export default ClientsDetailView; 