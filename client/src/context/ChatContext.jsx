/* eslint-disable react/prop-types */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const user = useContext(AuthContext);
  const currentUser = useMemo(() => user.user, [user]);

  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [sendMessageError, setSendMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io("http://localhost:3000");
      // "http://localhost:3000";

      setSocket(newSocket);

      return () => {
        newSocket?.disconnect();
      };
    }
  }, [currentUser]);

  //online users
  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket.emit("addNewUser", currentUser?.userId);

    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  //send messages
  useEffect(() => {
    if (socket === null) {
      return;
    }

    if (socket && currentChat) {
      const recipientId = currentChat.members.find(
        (id) => id !== currentUser.userId
      );
      socket.emit("sendMessage", { ...newMessage, recipientId });
    }
  }, [currentChat, newMessage, socket]);

  // receive message and notification
  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket.on("getMessage", (res) => {
      console.log(res);
      if (currentChat?._id !== res.chatId) {
        return;
      }

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      let isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      // isChatOpen === undefined ? (isChatOpen = false) : (isChatOpen = true);

      if (isChatOpen) {
        setNotifications((prev) => [...prev, { ...res, isRead: true }]);
      } else {
        setNotifications((prev) => [...prev, res]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("error fetching users", response);
      }
      const pChats = response.filter((u) => {
        let isChatCreated = false;

        if (currentUser?.userId === u._id) {
          return false;
        }

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response);
    };

    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (currentUser?.userId) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(
          `${baseUrl}/chat/${currentUser?.userId}`
        );

        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };

    getUserChats();
  }, [currentUser]);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chat/createchat`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      return console.log("error creating chat", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessageLoading(true);
      const response = await getRequest(
        `${baseUrl}/message/${currentChat?._id}`
      );
      setIsMessageLoading(false);

      if (response.error) {
        return setMessageError(response);
      }

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) {
        console.log("type something ...");
      }

      const response = await postRequest(
        `${baseUrl}/message/createmessage`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender.userId,
          text: textMessage,
        })
      );

      if (response.error) {
        return setSendMessageError(response);
      }
      setNewMessage(response);
      setMessages((prev) => [...prev, response]);

      setTextMessage("");
    },
    []
  );

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const modifiedNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(modifiedNotifications);
  }, []);

  const markANotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      // find chat to open
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user.userId, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      // mark notification as read
      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return {
            ...n,
            isRead: true,
          };
        } else {
          return el;
        }
      });
      updateCurrentChat(desiredChat);

      setNotifications(mNotifications);
    },
    []
  );

  const markThisUsersNotificationAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      const mNotifications = notifications.map((el) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });
        return notification;
      });
      setNotifications(mNotifications);
    },
    []
  );

  // // Group //

  // //states
  // const [groupChats, setGroupChats] = useState([]);
  // const [currentGroupChat, setCurrentGroupChat] = useState(null);
  // const [groupMessages, setGroupMessages] = useState(null);
  // const [newGroupMessage, setNewGroupMessage] = useState(null);

  // const updateCurrentGroupChat = useCallback((group) => {
  //   setCurrentGroupChat(group);
  // }, []);

  // const createGroupChat = useCallback(async (members, groupName) => {
  //   //create new group
  //   if (groupName === "") {
  //     groupName = "group";
  //   }
  //   const response = await postRequest(
  //     `${baseUrl}/chat/group/create-group`,
  //     JSON.stringify({ members, groupName })
  //   );

  //   if (response.error) {
  //     return console.log("error creating chat", response);
  //   }

  //   setGroupChats((prev) => [...prev, response]);
  // }, []);

  // useEffect(() => {
  //   //fetch user groups
  //   const getUserGroups = async () => {
  //     if (user?.userId) {
  //       const response = await getRequest(
  //         `${baseUrl}/chat/group/get-user-groups/${user?.userId}`
  //       );

  //       if (response.error) {
  //         return console.log("error creating chat", response);
  //       }

  //       setGroupChats(response);
  //     }
  //   };

  //   getUserGroups();
  // }, [user, groupChats]);

  // const sendGroupTextMessage = useCallback(
  //   async (groupTextMessage, sender, currentGroupId, setGroupTextMessage) => {
  //     if (!groupTextMessage) {
  //       console.log("type something ...");
  //     }

  //     const response = await postRequest(
  //       `${baseUrl}/message/group/create-group-message`,
  //       JSON.stringify({
  //         chatId: currentGroupId,
  //         senderId: sender.userId,
  //         text: groupTextMessage,
  //       })
  //     );
  //     if (response.error) {
  //       return setSendMessageError(response);
  //     }
  //     setNewGroupMessage(response);
  //     setGroupMessages((prev) => [...prev, response]);

  //     setGroupTextMessage("");
  //   },
  //   []
  // );

  // useEffect(() => {
  //   const getGroupMessages = async () => {
  //     const response = await getRequest(
  //       `${baseUrl}/message/group/${currentGroupChat?._id}`
  //     );

  //     if (response.error) {
  //       return setMessageError(response);
  //     }

  //     setGroupMessages(response);
  //   };

  //   getGroupMessages();
  // }, [currentGroupChat, newGroupMessage]);

  // // create new group for socket

  // useEffect(() => {
  //   if (socket === null) {
  //     return;
  //   }
  //   socket.emit("createNewGroup", { currentGroupChat });
  // }, [socket, currentGroupChat]);

  // //send  group messages
  // useEffect(() => {
  //   if (socket === null) {
  //     return;
  //   }

  //   if (socket && currentGroupChat) {
  //     // const recipientGroupmembers = currentGroupChat?.members.filter(
  //     //   (member) => member._id !== user.userId
  //     // );

  //     socket.emit("sendGroupMessage", {
  //       newGroupMessageText: newGroupMessage?.text,
  //       currentGroupChatId: currentGroupChat?._id,
  //     });
  //   }
  // }, [currentGroupChat, newGroupMessage, socket]);

  // useEffect(() => {
  //   if (socket === null) {
  //     return;
  //   }
  //   socket.on("getGroupMessage", (res) => {
  //     setGroupMessages((prev) => [...prev, res]);
  //   });
  // }, [socket, currentGroupChat]);
  return (
    <>
      <ChatContext.Provider
        value={{
          userChats,
          isUserChatsLoading,
          userChatsError,
          potentialChats,
          createChat,
          updateCurrentChat,
          currentChat,
          messages,
          isMessageLoading,
          messageError,
          sendTextMessage,
          sendMessageError,
          onlineUsers,
          allUsers,
          notifications,
          markAllNotificationsAsRead,
          markANotificationAsRead,
          markThisUsersNotificationAsRead,
          // //group
          // createGroupChat,
          // groupChats,
          // sendGroupTextMessage,
          // updateCurrentGroupChat,
          // currentGroupChat,
          // groupMessages,
        }}
      >
        {children}
      </ChatContext.Provider>
    </>
  );
};
