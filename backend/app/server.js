const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const fs = require('fs');

const routes = require('./routes/index.js')(app, fs);

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + '/frontend/dist'));




app.listen(port, () => {
  console.log(`Api is live on localhost:${port}`);
});
