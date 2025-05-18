const express = require("express");
const UserController = require("../controllers/UserController");
const { authenticate, roleRequired } = require("../middleware/auth");
const { ro } = require("@faker-js/faker");
const router = express.Router();

router.post("/login", UserController.handleLogin); // login
router.post("/createUser", UserController.createUser); // to register
// log out : delete token will be implemented in client-side (front-end)
router.post("/changePassword/", authenticate, UserController.changePassword); //update your password


//
router.get(
  "/getAllUser",
  authenticate, // Example for middleware 
  roleRequired("admin"),
  UserController.displayAllUser
); // for admin function
router.get("/getProfile", authenticate, UserController.getEditInformation); // get user info by id

router.post("/userUpdate", authenticate, UserController.updateUser); // update user information
//forgot password ???

//

router.post(
  "/punish/:id",
  authenticate,
  roleRequired("admin"),
  UserController.getPunishmentOnUser
); //ban user

router.post(
  "/unpunish/:id",
  authenticate,
  roleRequired("admin"),
  UserController.unBanUser
);

router.post(
  "/userDelete/:id",
  authenticate,
  roleRequired("admin"),
  UserController.deleteUser
); // delete user

//forgot pasword
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);

//take infor by ID
router.get("/getUserInfo", UserController.getUser);

module.exports = router;
