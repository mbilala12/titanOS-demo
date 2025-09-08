require('dotenv').config();
module.exports = {
  baseURL: process.env.TITANOS_BASE_URL || 'https://app.titanos.tv/'
};