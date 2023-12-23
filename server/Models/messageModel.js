const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: String,
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    isGroupMessage: { type: Boolean, default: false },
    groupMembers: Array,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
