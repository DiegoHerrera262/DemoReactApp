import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
// import mapPin from "../../assets/pin.png";
import errorImage from "../../assets/errorImage.png";

const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;

const StaticMap = (props) => {
  const { mapContainerStyle, zoom, center, markerCoords, className, mapPin } =
    props;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleMapsToken,
  });

  if (loadError) {
    return (
      <p align="center">
        <img src={errorImage} alt="" width="40px" height="40px" />
        Error al cargar el mapa.
      </p>
    );
  }

  if (!isLoaded) {
    return <div className={className["loading-div"]} />;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={zoom}
      center={{
        lat: center.latitude,
        lng: center.longitude,
      }}
    >
      <Marker
        position={{
          lat: markerCoords.latitude,
          lng: markerCoords.longitude,
        }}
        icon={{
          url: mapPin,
          scaledSize: {
            width: 35,
            height: 35,
          },
        }}
      />
    </GoogleMap>
  );
};

export default StaticMap;
