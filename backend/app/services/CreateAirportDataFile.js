const request = require('request')
const csv = require('csv-parser')
const { getLongLat, getDistanceBetweenGeoPoints, getAirportsDataFilePath } = require('../helpers/airport.js')

const CreateAirportDataFile = (res, fs) => {

  let dataJSON = []
  const dataFilePath = getAirportsDataFilePath()

  request('https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat')
    .pipe(csv({
        headers: [
            'airline',
            'airline_id',
            'src',
            'src_id',
            'dst',
            'dst_id',
            'codeshare',
            'stops',
            'equipment'
        ]
    }))
    .on('data', (row) => {
        const srcAirportGeoPoints = getLongLat(row.src)
        const dstAirportGeoPoints = getLongLat(row.dst)

        if (srcAirportGeoPoints && dstAirportGeoPoints) {
          // Get distance between two points in kilometers
          const distance = getDistanceBetweenGeoPoints(srcAirportGeoPoints, dstAirportGeoPoints, true)

          dataJSON.push({
            src: row.src,
            dst: row.dst,
            dist: distance
          });
        }

    })
    .on('end', () => {
      fs.writeFileSync(dataFilePath, JSON.stringify(dataJSON));
    })
    .on('error', function(e) {
      console.error('Bad data', e);
    })

    res.status(200).send({
      response: 'New routes data being generated'
    });
}

exports.CreateAirportDataFile = CreateAirportDataFile;
