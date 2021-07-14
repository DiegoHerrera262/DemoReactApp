import axios from "axios";

const GoogleMapsToken = process.env.REACT_APP_GOOGLE_MAPS_TOKEN;

// get address from coordinates
const getAddress = async (addressCoords) => {
  try {
    const { latitude, longitude } = addressCoords;
    const GoogleGeocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GoogleMapsToken}`;
    const result = await axios.get(GoogleGeocodeURL);
    if (result.data.results.length > 0) {
      return result.data.results[0].formatted_address.toString().trim();
    }
  } catch (error) {
    console.log(error);
    return "";
  }
};

export default getAddress;
