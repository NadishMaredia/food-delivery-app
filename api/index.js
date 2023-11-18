const express = require('express');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './config.env') })

const config = require('./config/config');
const database = require('./database/db');
const defaultRoute = require('./routes/defaultRoute');

const app = express();

app.use('/', defaultRoute)

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
