const express = require("express");

const chatRoute = express.Router();

const {
  createChat,
  findUserChats,
  findChat,
} = require("../Controller/chatController");

chatRoute.post("/createchat", createChat);
chatRoute.get("/:userId", findUserChats);
chatRoute.get("/find/:firstId/:secondId", findChat);

module.exports = chatRoute;
