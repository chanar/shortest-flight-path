const {
  getShortestPathFromLib } = require('../app/services/Airport.js')

const testMatrix = {
  a: { b: 7, c: 9, f: 14 },
  b: { c: 10, d: 15 },
  c: { d: 11, f: 2 },
  d: { e: 6 },
  e: { f: 9 },
}

const testPathResult = ['a', 'c', 'd', 'e']
const fromTo = { from: 'a', to: 'e' };

describe('Separate libraries for shortest path', () => {

  it('should get correct shortest path using node-dijkstra library', () => {
    const path = getShortestPathFromLib(fromTo, 'node-dijkstra', testMatrix)

    expect(path).toEqual(testPathResult);
  })

  it('should get correct shortest path using dijkstrajs library', () => {
    const path = getShortestPathFromLib(fromTo, 'dijkstrajs', testMatrix)

    expect(path).toEqual(testPathResult);
  })
})
