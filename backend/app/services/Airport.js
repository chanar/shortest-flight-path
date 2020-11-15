const dijkstra = require('dijkstrajs')
const dijkstraShortestPathFromTo = dijkstra.find_path;
const {
  getAirportsData,
  getCountryByIata,
  getAirportsByCountry,
  getDistsanceBetweenTwoAirports } = require('../helpers/airport.js')

// Gets array object of airport connections and distance
const routesData = getAirportsData()

// Returns empty array if no flights found or flight count > 5.
// Returns shortest route with possible route changes
const getShortestRoutePath = (src, dst, maxAirports, distance) => {
  const routesGraph = getRoutesGraph()
  let possibleRouteChanges = {}
  let routes = []

  // Add one for total count of airports
  maxAirports = maxAirports+1

  // In case source or destination doesn't exist
  try {
    routes = dijkstraShortestPathFromTo(routesGraph, src, dst)
  } catch (e) {}

  // Invalidate route if it exceeds max layovers
  if (!checkFlightRouteLength(routes, maxAirports)) return [];

  // if not a direct flight, look for possible layover changes in distance
  if (!isDirectFlight(routes)) {
    const layovers = routes.slice(0, -1)
    maxAirports--

    for (i = 0; i < layovers.length; i++) {
      const airport = layovers[i+1]

      if (airport) {
        const closeByAirports = findAirportsInDistance(airport, distance)

        closeByAirports.forEach(function(layoverSrc) {
          let newRoute = null

          try {
            newRoute = dijkstraShortestPathFromTo(routesGraph, layoverSrc, dst)
          } catch (e) {}

          if (newRoute) {
            if (checkFlightRouteLength(routes, maxAirports-i)) {
              if (!possibleRouteChanges[airport]) possibleRouteChanges[airport] = []
              possibleRouteChanges[airport].push(newRoute);
            }
          }

        })

      }
    }
  }

  return {
    shortestRoute: routes,
    possibleRouteChanges: possibleRouteChanges
  };
}

// Returns graph for dijkstra algo
// {
//   <iata>: { <iata>: <distance> }
// }
const getRoutesGraph = () => {
  let routesGraph = {}

  for (const k in routesData) {
    const src = routesData[k].src
    const dst = routesData[k].dst
    const dist = Number(routesData[k].dist)

    if (!routesGraph[src]) routesGraph[src] = {}
    routesGraph[src][dst] = dist;
  }

  return routesGraph;
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
