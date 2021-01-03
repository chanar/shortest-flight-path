const fs = require('fs')
const path = require('path')
const airports = require('airport-codes-updated')
const GeoPoint = require('geopoint')

// Latitude and longitude values by an airport iata
const getLongLat = (iata) => {

  if (airports.findWhere({ iata: iata })) {
    const latitude = airports.findWhere({ iata: iata }).get('latitude')
    const longitude = airports.findWhere({ iata: iata }).get('longitude')

    return {
      latitude: Number(latitude),
      longitude: Number(longitude)
    }

  }

  return null;
}

// Distance between two geo points in kilometers or miles
const getDistanceBetweenGeoPoints = (geoPointStart, geoPointEnd, isKM) => {
  const startPoint = new GeoPoint(geoPointStart.latitude, geoPointStart.longitude)
  const endPoint = new GeoPoint(geoPointEnd.latitude, geoPointEnd.longitude)
  const distance = startPoint.distanceTo(endPoint, isKM).toFixed(2)

  return Number(distance);
}

// Distsance between airports
const getDistsanceBetweenTwoAirports = (iataStart, iataEnd) => {
  const startGeoLoc = getLongLat(iataStart)
  const endGeoLoc = getLongLat(iataEnd)

  const distance = getDistanceBetweenGeoPoints(startGeoLoc, endGeoLoc, true)

  return Number(distance);
}

// Route data file path
const getAirportsDataFilePath = () => {
  return path.join(process.cwd(), 'backend/app/data/airportRoutesData.json');
}

// Airports data as array object
const getAirportsData = () => {
  return JSON.parse(fs.readFileSync(getAirportsDataFilePath()));
}

// All airport iata codes for each country
const getAirportsListByCountry = () => {
  const airportsJSON = airports.toJSON()

  let airportsByCountry = {}

  for (const k in airportsJSON) {
    const country = airportsJSON[k].country
    const iata = airportsJSON[k].iata

    if (iata.length) {
      if (!airportsByCountry[country]) airportsByCountry[country] = []
      if (iata !== '\\N') {
        airportsByCountry[country].push(iata);
      }
    }
  }

  return airportsByCountry;
}

// Get airport iata codes for a country
const getAirportsByCountry = (country) => {
  const airports = getAirportsListByCountry()

  return airports[country];
}

// Get country name by airport iata code
const getCountryByIata = (iata) => {
  const airports = getAirportsListByCountry()

  for (const k in airports) {
    if (airports[k].includes(iata)) {
      return k;
    }
  }

  return null;
}

// Returns graph for dijkstra algo
// {
//   <iata>: { <iata>: <distance> }
// }
const getRoutesGraph = (routesData) => {
  let routesGraph = {}

  for (i = 0; i < routesData.length; i++) {
    const src = routesData[i].src
    const dst = routesData[i].dst
    const dist = Number(routesData[i].dist)

    // Skip if the destination is same as source (distance is 0)
    if (dist > 0) {
      if (!routesGraph[src]) routesGraph[src] = {}
      routesGraph[src][dst] = dist;
    }
  }

  return routesGraph;
}

module.exports.getLongLat = getLongLat;
module.exports.getDistanceBetweenGeoPoints = getDistanceBetweenGeoPoints;
module.exports.getAirportsDataFilePath = getAirportsDataFilePath;
module.exports.getAirportsData = getAirportsData;
module.exports.getAirportsByCountry = getAirportsByCountry;
module.exports.getCountryByIata = getCountryByIata;
module.exports.getDistsanceBetweenTwoAirports = getDistsanceBetweenTwoAirports;
module.exports.getRoutesGraph = getRoutesGraph;
