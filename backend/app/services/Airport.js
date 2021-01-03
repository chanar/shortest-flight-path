const dijkstra = require('dijkstrajs')
const Graph = require('node-dijkstra')

const dijkstraShortestPathFromTo = dijkstra.find_path;
const {
  getAirportsData,
  getCountryByIata,
  getAirportsByCountry,
  getDistsanceBetweenTwoAirports,
  getRoutesGraph } = require('../helpers/airport.js')

// Gets array object of airport connections and distance
const routesData = getAirportsData()
let routesGraph = getRoutesGraph(routesData)

// Returns empty array if no flights found or flight count > 5.
// Returns shortest route with possible route changes
const getShortestRoutePath = (fromTo, maxAirports, lib) => {
  let routes = []

  // Add one for total count of airports
  maxAirports = maxAirports+1

  // In case source or destination doesn't exist
  try {
    routes = getShortestPathFromLib(fromTo, lib)
  } catch (e) {}

  if (!routes) return [];

  // Invalidate route if it exceeds max layovers
  if (!checkFlightRouteLength(routes, maxAirports)) return [];

  return {
    shortestRoute: routes,
    possibleRouteChanges: getPossibleRouteChanges(routes, maxAirports, fromTo, lib)
  };
}

const getPossibleRouteChanges = (routes, maxAirports, fromTo, lib) => {
  let possibleRouteChanges = {}

  if (isDirectFlight(routes)) {
    return possibleRouteChanges;
  }

  const layovers = routes.slice(0, -1)
  const distance = 100
  const airportsBeforeChange = []

  layovers.forEach(function(airportToChange, index) {

    if (index > 0) {
      const closeByAirports = findAirportsInDistance(airportToChange, distance)

      closeByAirports.forEach(function(layoverSrc) {
        let newRoute = null

        try {
          fromTo.from = layoverSrc
          newRoute = getShortestPathFromLib(fromTo, lib);
        } catch (e) {}

        if (newRoute) {
          if (checkFlightRouteLength(airportsBeforeChange.concat(newRoute), maxAirports)) {
            if (!possibleRouteChanges[airportToChange]) possibleRouteChanges[airportToChange] = []
            possibleRouteChanges[airportToChange].push(newRoute);
          }
        }
      })
    }

    airportsBeforeChange.push(airportToChange)
  })

  return possibleRouteChanges;
}

const getShortestPathFromLib = (fromTo, lib, graph = null) => {
  let pathArray = []

  // For testing purpose
  if (graph !== null) {
    routesGraph = graph;
  }

  if (lib == 'node-dijkstra') {
    const route = new Graph(routesGraph)
    const path = route.path(fromTo.from, fromTo.to, { cost: true })
    pathArray = path.path
  } else {
    pathArray = dijkstraShortestPathFromTo(routesGraph, fromTo.from, fromTo.to)
  }

  return pathArray;
}

const findAirportsInDistance = (iataStart, distanceAllowed) => {
  if (!iataStart) return null;

  const airportCountry = getCountryByIata(iataStart)
  const countryAirports = getAirportsByCountry(airportCountry)

  let closeByAirports = []

  countryAirports.forEach(function(iataEnd) {
    if (iataStart !== iataEnd) {
      const airportDistances = getDistsanceBetweenTwoAirports(iataStart, iataEnd)

      if (airportDistances <= distanceAllowed) {
        closeByAirports.push(iataEnd)
      }
    }
  })

  return closeByAirports;
}

const checkFlightRouteLength = (routes, max) => {
  return routes.length <= max;
}

const isDirectFlight = (routes) => {
  return routes.length == 2
}

exports.getShortestRoutePath = getShortestRoutePath;
exports.getRoutesGraph = getRoutesGraph;
exports.findAirportsInDistance = findAirportsInDistance;
exports.checkFlightRouteLength = checkFlightRouteLength;
exports.isDirectFlight = isDirectFlight;
exports.getShortestPathFromLib = getShortestPathFromLib;
exports.getPossibleRouteChanges = getPossibleRouteChanges;
