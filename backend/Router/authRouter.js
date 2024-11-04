const route = require("express").Router();
const { logout, isAuthenticated } = require("../controller/authController");

route.post("/logout", logout);
route.get("/auth/check", isAuthenticated);

module.exports = route;
