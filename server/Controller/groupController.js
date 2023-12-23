const Chat = require("../Models/chatModel");
const Group = require("../Models/groupModel");

const createGroup = async (req, res) => {
  try {
    const { members, groupName } = req.body;

    const newGroup = new Group({
      members,
      groupName,
      isGroupChat: true,
    });

    const savedGroup = await newGroup.save();

    res.status(200).json(savedGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const editGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const { membersToAdd, membersToRemove, groupName } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "group not found" });
    }

    if (membersToAdd) {
      group.members = [...new Set([...group.members, ...membersToAdd])];
      //pass an array
    }

    if (membersToRemove) {
      group.members = group.members.filter(
        (member) => !membersToRemove.includes(member)
      );
      //pass an array
    }

    if (groupName) {
      group.groupName = groupName;
    }

    const updatedGroup = await group.save();

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const userGroups = await Group.find({
      members: { $in: [userId] },
    }).populate({
      path: "members",
      select: "name", // Specify the field(s) you want to populate (in this case, 'name')
    });

    res.status(200).json(userGroups);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createGroup, editGroup, getUserGroups };
