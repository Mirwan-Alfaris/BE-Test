const express = require('express');
// eslint-disable-next-line no-unused-vars
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const WebSocket = require('ws');
dotenv.config();
const app = express();
const wss = new WebSocket.Server({server: app});
const {callmeWebSocket} = require('./app/controllers/exampleController');

const corsOptions = {
  origin: ['http://localhost:8080'],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// database
const db = require('./app/models');

db.sequelize.sync();

// never enable the code below in production
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Database with { force: true }");
//   // initial();
// });

// Web Socket
wss.on('connection', (ws) => {
  console.log('Client Connection');

  ws.on('close', () =>{
    console.log('Client Disconnected');
  });
});

// fetch data with interval
const INTERVAL = 3 * 60 * 1000;
const sendDataToWebSocket = () => {
  callmeWebSocket(wss);
  setTimeout(sendDataToWebSocket, INTERVAL);
};

sendDataToWebSocket();

// simple route
app.get('/', (req, res) => {
  res.json({message: 'Hello'});
});

// routes
require('./app/routes/exampleRoutes')(app);
require('./app/routes/authRoutes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
