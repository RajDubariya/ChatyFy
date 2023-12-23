const express = require("express");

const groupRoute = express.Router();

const {
  createGroup,
  editGroup,
  getUserGroups,
} = require("../Controller/groupController");

groupRoute.post("/create-group", createGroup);
groupRoute.patch("/edit-group/:groupId", editGroup);
groupRoute.get("/get-user-groups/:userId", getUserGroups);

module.exports = groupRoute;
