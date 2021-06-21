import * as React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
// import mapPin from '../assets/pin.png';

// const mapStyle = 'mapbox://styles/diegoherrera262/ckpossqqj09fy17npwfhqkadq'

const SuperVeciMap = (props) => {
    return (
        <GoogleMap
            defaultZoom={11}
            defaultCenter={{ lat: 4.637764262457622, lng: -74.14443 }}
        >
            {props.isMarkerShown && <Marker position={{ lat: 4.637764262457622, lng: -74.14443 }} />}
        </GoogleMap>
    );
}

const Map =  withScriptjs(withGoogleMap(SuperVeciMap));

export default Map;