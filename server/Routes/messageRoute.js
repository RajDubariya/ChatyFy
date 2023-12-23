const express = require("express");
const {
  createMessage,
  getMessages,
  createGroupMessage,
  getGroupMessages,
} = require("../Controller/messageController");

const messageRoute = express.Router();

messageRoute.post("/createmessage", createMessage);
messageRoute.get("/:chatId", getMessages);

messageRoute.post("/group/create-group-message", createGroupMessage);
messageRoute.get("/group/:chatId", getGroupMessages);

module.exports = messageRoute;
