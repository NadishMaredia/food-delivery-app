const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
require('dotenv').config({ path: path.resolve(__dirname, './config.env') })

const config = require('./config/config');
const database = require('./database/db');
const defaultRoute = require('./routes/defaultRoute');
const restaurantRoute = require('./routes/restaurantRoute');
const menuRoute = require('./routes/menuRoute');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', defaultRoute)
app.use('/api', restaurantRoute)
app.use('/api', menuRoute)

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    database.connection.close(() => {
      console.log('MongoDB connection disconnected through app termination');
      process.exit(0);
    });
  });
