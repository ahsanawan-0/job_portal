const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token; // Retrieve the token from cookies

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Forbidden Request",
        });
      }
      req.user = { id: user.id };
      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = verifyToken;
