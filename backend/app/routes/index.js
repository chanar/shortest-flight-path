const path = require('path')
const cors = require('cors')
const { CreateAirportDataFile } = require('../services/CreateAirportDataFile');
const { getShortestRoutePath } = require('../services/Airport');

const appRouter = (app, fs) => {

  app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), '/frontend/dist', 'index.html' ));
  });

  app.get('/api/routes/create', (req, res) => {
    // Generates new route data file
    CreateAirportDataFile(res, fs);
  });

  app.get('/api/routes/path', cors(), (req, res) => {
    const srcAirport = req.query.src
    const dstAirport = req.query.dst
    const maxFlights = Number(req.query.maxflights)

    // Get shortest route path with max 5 airports with layover possible changes in 100km radius
    const flightRoutes = getShortestRoutePath(srcAirport, dstAirport, maxFlights, 100);

    res.status(200).send({
      response: 'OK',
      data: {
        flightRoutes
      }
    });
  });
};

module.exports = appRouter;
