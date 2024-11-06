const userModel = require("../models/userModel");

const verifyAdmin = async (req, res, next) => {
  if (req.user) {
    const user = await userModel.findUserById(req.user.id);
    if (user && user.designation === "admin") {
      // console.log(user.designation);
      next();
    } else {
      // console.log(user.designation);
      res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
  } else {
    res.status(403).json({
      success: false,
      message: "Error Fetching Data.",
    });
  }
};

module.exports = verifyAdmin;
