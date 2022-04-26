/**
 * Get GeoJSON output for a set of coordinates LatLong.
 *
 * =GEOJSON_SPLIT_FEATURES()
 *
 * @param {String} GeoJSON input, will use MAP global constant if null
 * @param {String} Attribute to use as id, will use 'name' if undefined
 * @param {String} Type of features to split, can be "Point" or "Polygon", will use 'Polygon' if undefined
 * @return {Array<String>} List of features
 * @customFunction
 */
function GEOJSON_SPLIT_FEATURES(geojson=null, nameAttribute="name", type="Polygon"){
  var geo = geojson?JSON.parse(geojson):MAP;
  var polygons = geo
    .features
    .filter(f=>f.geometry.type==type);
  return polygons.map(p=>[p.properties[nameAttribute],JSON.stringify(p)]);
}


/**
 * Extracts LatLong data from a GeoJSON input.
 *
 * =GEOJSON_POINTS_TO_LATLONGS()
 *
 * @param {String} GeoJSON input, will use MAP global constant if null
 * @return {Array<String>} List of LatLongs
 * @customFunction
 */
function GEOJSON_POINTS_TO_LATLONGS(geojson=null){
  var geo = geojson?JSON.parse(geojson):MAP;
  var points = geo
    .features
    .filter(f=>f.geometry.type=="Point")
    .map(f=> `${f.geometry.coordinates[1]}, ${f.geometry.coordinates[0]}`);
  return points;
}

/**
 * Tell which region contains the coordinates passed as argument.
 *
 * =GEOJSON_LATLONG_REGION()
 *
 * @param {String} Coordinates to check
 * @param {String} Attribute to use as id, will use 'name' if undefined
 * @param {String} GeoJSON input, will use MAP global constant if null
 * @return {String} Id of the matching region
 * @customFunction
 */
function GEOJSON_LATLONG_REGION(latLong, regionNameAttribute="name", geojson=null){
  var point = getGeoPointFeature(latLong);
  var map = geojson ? JSON.parse(geojson) : MAP;
  var matchingRegions = map.features
    .filter(f => f.geometry.type=="Polygon" && turf.booleanPointInPolygon(point, f))
    .map(r => r.properties[regionNameAttribute]);
  return matchingRegions.length > 0 ? matchingRegions[0] : null;
}

/**
 * Get GeoJSON output for a set of coordinates LatLong.
 *
 * =GEOJSON_POINTS("A1:A20")
 *
 * @param {Array<String>} List of coordinates to include in GeoJSON
 * @return {String} GeoJSON output
 * @customFunction
 */
function GEOJSON_POINTS(coords,names=null){
  console.log(names);
  return JSON.stringify(getGeoWithPoints(coords.map(c=>""+c),names));
}

function getGeoPointFeature(coords, props=null){
  var point = {
      "type": "Feature",
      "properties": props,
      "geometry": {
        "type": "Point",
        "coordinates": coordsToGeoPoint(coords)
      }};
  return point;
}

function getGeoWithPoints(coordsArr, namesArr){
  var ret = {
    "type": "FeatureCollection",
    "features": []
  };
  coordsArr.forEach((c,i) => {
    if(c!=""){
      ret.features.push(getGeoPointFeature(c,{name:(namesArr && namesArr.length>i)?namesArr[i]:i}));
    }
  });
  return ret;
}

// https://stackoverflow.com/a/57653830
function coordsToGeoPoint(coords){
  return coords.split(',').map(s => parseFloat(s)).reverse();
}
