const router = require("express").Router();
const {
  signUp,
  signIn,
  resetPassword,
  getUserData,
  updateUserData,
  getAllUsers,
  deleteUser,
  getAllUsersNotAdmin,
} = require("../controller/userController");
const verifyToken = require("../middleweres/verifyToken");
const verifyAdmin = require("../middleweres/verifyAdmin");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/reset-password", resetPassword);
router.get("/userData", verifyToken, getUserData);
router.post("/updateUserData", verifyToken, updateUserData);
router.get("/admin/users", verifyToken, verifyAdmin, getAllUsers);
router.delete("/delete-user", verifyToken, verifyAdmin, deleteUser);
router.get("/notadmin/users", verifyToken, verifyAdmin, getAllUsersNotAdmin);

// router.get("/profile", verifyToken, (req, res) => {

//   res
//     .status(200)
//     .json({ message: "Profile accessed successfully", userId: req.user.id });
// });

module.exports = router;
