const {
  getRoutesGraph,
  getLongLat,
  getDistanceBetweenGeoPoints,
  getDistsanceBetweenTwoAirports,
  getAirportsByCountry,
  getCountryByIata } = require('../app/helpers/airport.js')

describe('Airport helpers', () => {
  it('getRoutesGraph() should return correct matrix', () => {

    // Airport sample data from data/airportRoutesData.json
    const airportData = [
      {"src":"AER","dst":"KZN","dist":"1506.83"},
      {"src":"ASF","dst":"KZN","dist":"1040.44"},
      {"src":"ASF","dst":"MRV","dist":"448.17"},
      {"src":"CEK","dst":"KZN","dist":"770.51"},
      {"src":"CEK","dst":"OVB","dist":"1338.63"}
    ]

    expect(getRoutesGraph(airportData)).toEqual({
      AER: { KZN: 1506.83 },
      ASF: { KZN: 1040.44, MRV: 448.17 },
      CEK: { KZN: 770.51, OVB: 1338.63 }
    });
  })

  it('getLongLat() should return airport\'s latitude and longitude', () => {
    const latLong = getLongLat('TLL')

    expect(latLong.latitude).toEqual(expect.any(Number));
    expect(latLong.longitude).toEqual(expect.any(Number));
  })

  it('getDistanceBetweenGeoPoints() should return distance between two geo points', () => {
    const tallinnAirport = getLongLat('TLL')
    const jfkAirport = getLongLat('JFK')

    const distanceInKM = getDistanceBetweenGeoPoints(tallinnAirport, jfkAirport, true)
    const distanceInMiles = getDistanceBetweenGeoPoints(tallinnAirport, jfkAirport, false)

    expect(distanceInKM).toEqual(expect.any(Number));
    expect(distanceInMiles).toEqual(expect.any(Number));
    expect(distanceInKM > distanceInMiles).toBeTruthy();
  })

  it('getDistsanceBetweenTwoAirports() should return distance between two airports', () => {
    const distance = getDistsanceBetweenTwoAirports('TLL', 'JFK')

    expect(distance).toEqual(expect.any(Number));
  })

  it('getAirportsByCountry() should return airports by country', () => {
    const airports = getAirportsByCountry('Estonia')

    expect(airports).toEqual([ 'KDL', 'URE', 'EPU', 'TLL', 'TAY' ]);
  })

  it('getCountryByIata() should return country name by airport code', () => {
    const country = getCountryByIata('TLL')

    expect(country).toEqual('Estonia');
  })

})
