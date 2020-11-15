# Find shortest flight path between two airports

This application searches for the shortest path in kilometers between two airports and uses Dijkstra's algorithm. In addition, it provides suggested route change if there is an airport close to a layover stop. Currently set to 100km radius.

You can see  it live here: [https://shortest-flight-path.herokuapp.com/](https://shortest-flight-path.herokuapp.com/)

![enter image description here](https://i.ibb.co/5M2Hhc4/Screenshot-2020-11-15-at-16-54-42.png)

## Data set
OpenFlights database is used for flight connections. Direct url for connecting flight dataset: [https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat](https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat)

`airport-codes-updated` npm package is used to get airport specific data.

## Start application
**Start backend**

    cd backend
    npm install
    npm start

Go to http://localhost:3000

**Build frontend**

    cd frontend
    npm install
    npm run build
    npm run start // For local development


## API

Generate new airport data set: [http://localhost:3000/api/routes/create](http://localhost:3000/api/routes/create)

Get shortest path between two airports [http://localhost:3000/api/routes/path?src=TLL&dst=GIG&maxflights=4](http://localhost:3000/api/routes/path?src=TLL&dst=GIG&maxflights=4)
