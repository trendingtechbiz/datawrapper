/**
 * Get the full address or an address component of a partial location or pair of coordinates (latitude, longitude) on Google Maps.
 *
 * =GMAPS_ADDRESS(partialAddress, part)
 *
 * @param {String} partialAddress Partial location, postcode or pair of latitude,longitude (e.g. "38.723491, -9.139714") to lookup
 * @param {String} part Address part to get, can be "country", "locality".
 * @return {String} Full formatted address.
 * @customFunction
 */
function GMAPS_ADDRESS (partialAddress, part = null) {
  return CallWithCache(GMAPS_ADDRESS_NC,[partialAddress,part]);
}

function GMAPS_ADDRESS_NC (partialAddress, part = null) {
  var res = Maps.newGeocoder().geocode(partialAddress);
  const { results: [data = {}] = [] } = res;

  console.log(data.address_components);

  if(!part){
    return data.formatted_address;
  }
  if(part=="json"){
    return JSON.stringify(data);
  }

  const [{ short_name, long_name } = {}] = data.address_components.filter(
    ({ types: [level] }) => {
      return level === part;
    }
  );
  return `${long_name} (${short_name})`;
}

/**
 * Get the full address or an address component of a partial location or pair of coordinates (latitude, longitude) on Google Maps.
 *
 * =GMAPS_REVERSEGEOCODE(latLong, part)
 *
 * @param {String} latLong Pair of latitude,longitude (e.g. "38.723491, -9.139714") to lookup
 * @param {String} part Address part to get, can be "country", "locality".
 * @return {String} Full formatted address.
 * @customFunction
 */
function GMAPS_REVERSEGEOCODE (latLong, part = null) {
  return CallWithCache(GMAPS_REVERSEGEOCODE_NC,[latLong,part]);
}

function GMAPS_REVERSEGEOCODE_NC (latLong, part = null) {
  var res = Maps.newGeocoder().reverseGeocode(latLong.split(',')[0].trim(),latLong.split(',')[1].trim());
  const { results: [data = {}] = [] } = res;

  console.log(data.address_components);

  if(!part){
    return data.formatted_address;
  }
  if(part=="json"){
    return JSON.stringify(data);
  }

  const [{ short_name, long_name } = {}] = data.address_components.filter(
    ({ types: [level] }) => {
      return level === part;
    }
  );
  return `${long_name} (${short_name})`;
}



/**
 * Get the coordinates (latitude, longitude) of a partial location on Google Maps.
 *
 * =GMAPS_LATLONG(partialAddress)
 *
 * @param {String} partialAddress Partial location, postcode or pair of latitude,longitude (e.g. "38.723491, -9.139714") to lookup
 * @return {String} Pair of latitude, longitude in the format "xx.xxx, yy.yyy".
 * @customFunction
 */
function GMAPS_LATLONG (partialAddress) {
  return CallWithCache(GMAPS_LATLONG_NC,[partialAddress]);
}
function GMAPS_LATLONG_NC (partialAddress) {
  var res = Maps.newGeocoder().geocode(partialAddress);
  const { results: [data = null] = [] } = res;
  console.log(data.address_components);

  const { geometry: { location: { lat, lng } } = {} } = data;
  return `${lat}, ${lng}`;
}
