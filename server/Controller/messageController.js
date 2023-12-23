const Message = require("../Models/messageModel");
const Chat = require("../Models/chatModel");
const Group = require("../Models/groupModel");

const createMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    const message = new Message({
      chatId,
      senderId,
      text,
    });

    const response = await message.save();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const createGroupMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;

    const chat = await Group.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Group not found" });
    }

    const newMessage = new Message({
      chatId,
      senderId,
      text,
      isGroupMessage: true,
      groupMembers: chat.members,
    });

    const savedMessage = await newMessage.save();

    res.status(200).json(savedMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId }).populate({
      path: "senderId",
      select: "name",
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createMessage,
  getMessages,
  createGroupMessage,
  getGroupMessages,
};
