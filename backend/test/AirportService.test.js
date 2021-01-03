const {
  getShortestRoutePath,
  findAirportsInDistance,
  getPossibleRouteChanges } = require('../app/services/Airport.js')

describe('Airport.js service', () => {

  it('getShortestRoutePath() should return shortest path between two airports', () => {
    const maxFlights = 4
    const shortestPath = getShortestRoutePath({ from: 'TLL', to: 'JFK' }, maxFlights)
    const flightLayoverCount = shortestPath.shortestRoute.length-1;

    const maxFlights2 = 2
    const shortestPath2 = getShortestRoutePath({ from: 'TLL', to: 'JFK' }, maxFlights2)

    expect(shortestPath.shortestRoute).toEqual([ 'TLL', 'TRD', 'KEF', 'JFK' ]);
    expect(flightLayoverCount).not.toBeGreaterThan(4)

    expect(shortestPath2).toEqual([]);
  })

  it('findAirportsInDistance() should return airports within given radius', () => {
    const closeByAirports = findAirportsInDistance('TLL', 150)

    expect(closeByAirports).toEqual([ 'KDL', 'EPU' ]);
  })

  it('getPossibleRouteChanges() should find additional route for destination', () => {
    const maxFlights = 4
    const shortestPath = getShortestRoutePath({ from: 'TLL', to: 'JFK' }, maxFlights)
    const additionalPath = getPossibleRouteChanges(shortestPath.shortestRoute, maxFlights, { from: 'TLL', to: 'JFK' })

    expect(additionalPath).toEqual({ TRD: [ [ 'OLA', 'OSL', 'JFK' ] ] });
    expect(additionalPath).toEqual(shortestPath.possibleRouteChanges);
  })

})
