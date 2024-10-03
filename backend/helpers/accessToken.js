// generateAccessToken.js
const jwt = require('jsonwebtoken');

const generateAccessToken = (data) => {
  if (!data) throw new Error('Data argument required');
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

module.exports = { generateAccessToken }; // Export as an object
