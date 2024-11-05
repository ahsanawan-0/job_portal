const router = require("express").Router();
const {
  signUp,
  signIn,
  resetPassword,
  getUserData,
  updateUserData,
} = require("../controller/userController");
const verifyToken = require("../middleweres/verifyToken");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/reset-password", resetPassword);
router.get("/userData", verifyToken, getUserData);
router.post("/updateUserData", verifyToken, updateUserData);

// router.get("/profile", verifyToken, (req, res) => {

//   res
//     .status(200)
//     .json({ message: "Profile accessed successfully", userId: req.user.id });
// });

module.exports = router;
