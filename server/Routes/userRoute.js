const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  findAllUsers,
} = require("../Controller/userController");

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/find/:userId", findUser);
userRoute.get("/", findAllUsers);

module.exports = userRoute;
