require('dotenv').config();

const config = {
  dbURI: process.env.DB_URI,
  port: process.env.PORT || 5000,
};

module.exports = config;
