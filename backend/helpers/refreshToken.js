const jwt = require("jsonwebtoken");

const generateRefreshToken = (data) =>{

  if (!data) throw new Error('Data argument required');
  jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}
module.exports = {generateRefreshToken};
