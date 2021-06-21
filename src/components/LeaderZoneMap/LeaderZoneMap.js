import * as React from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import mapPin from '../assets/pin.png';

const mapStyle = 'mapbox://styles/diegoherrera262/ckpossqqj09fy17npwfhqkadq'

function Map() {
    const [viewport, setViewport] = React.useState({
    longitude: -122.45,
    latitude: 37.78,
    zoom: 14
    });

    return (
        <ReactMapGL 
            {...viewport} 
            width="100%" 
            height="400px" 
            onViewportChange={setViewport} 
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} 
        >
            <Marker draggable latitude={37.78} longitude={-122.45}>
                <div>
                    Hola
                </div>
            </Marker>
        </ReactMapGL>
    );    
}


export default Map;