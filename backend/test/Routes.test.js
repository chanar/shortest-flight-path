const request = require('supertest')
const app = require('../app')

describe('Service API', () => {
  it('should get shortest path from TLL to JFK', async () => {
    const res = await request(app)
      .get('/api/routes/path?src=TLL&dst=JFK&maxflights=4')
      .send({})

    expect(res.statusCode).toEqual(200)
    expect(res.body.data.flightRoutes.shortestRoute.length).toEqual(4)
  })
})
