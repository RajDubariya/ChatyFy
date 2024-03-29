const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupName: String,
    isGroupChat: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
