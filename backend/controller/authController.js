const jwt = require("jsonwebtoken");
module.exports = {
  logout: (req, res) => {
    res.clearCookie("token", { path: "/" }); // Clears the 'token' cookie
    res.status(200).json({ message: "Logged out successfully" });
  },
  isAuthenticated: (req, res) => {
    const token = req.cookies.token; // Get the token from the cookie
    // console.log("jkhhgiuhkuhkihihihi", token);
    if (!token) {
      return res.send(false); // Not authenticated
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.status(401).json("false"); // Token is invalid
      }
      return res.json(true); // Authenticated
    });
  },
};
