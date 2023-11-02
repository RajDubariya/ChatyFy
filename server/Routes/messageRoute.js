const express = require("express");
const {
  createMessage,
  getMessages,
} = require("../Controller/messageController");

const messageRoute = express.Router();

messageRoute.post("/createmessage", createMessage);
messageRoute.get("/:chatId", getMessages);

module.exports = messageRoute;
