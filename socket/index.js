const { Server } = require("socket.io");

const io = new Server({
  cors: "http://localhost:5173",
  methods: ["GET", "POST"],
});

let onlineUsers = [];
let groups = [];

io.on("connection", (socket) => {
  socket.on("addNewUser", (userId) => {
    if (userId) {
      !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
    }

    io.emit("getOnlineUsers", onlineUsers);
  });

  //single chat
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user?.userId === message.recipientId
    );

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message?.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  //group chat

  socket.on("createNewGroup", (res) => {
    const chatId = res?.currentGroupChat?._id;
    const members = res?.currentGroupChat?.members;

    if (groups.some((group) => group.chatId === chatId)) {
      return;
    }

    if (chatId && members) {
      const newGroup = { chatId, members: [] };

      members?.forEach((member) => {
        const user = onlineUsers.find(
          (onlineuser) => onlineuser.userId === member._id
        );

        if (user) {
          newGroup.members.push(user.socketId);
          // Join each member to the group room
          socket.join(chatId);
        }
      });

      groups.push(newGroup);
    }
    io.emit("getGroups", groups);
  });
  socket.on("sendGroupMessage", (groupMessageRes) => {
    const text = groupMessageRes?.newGroupMessage?.text;
    const chatId = groupMessageRes?.currentGroupChat?._id;

    if (text && chatId) {
      const group = groups.find((group) => group.chatId === chatId);

      if (group) {
        io.to(chatId).emit("getGroupMessage", groupMessageRes);
      }
    }
  });
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    groups.forEach((group) => {
      group.members = group.members.filter(
        (memberSocketId) => memberSocketId !== socket.id
      );

      if (group.members.length === 0) {
        groups = groups.filter((g) => g.chatId !== group.chatId);
      }
    });
    io.emit("getOnlineUsers", onlineUsers);
    io.emit("getGroups", groups);
  });
});

io.listen(3000);
