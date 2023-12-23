import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";

import {
  baseUrl,
  getRequest,
  patchRequest,
  postRequest,
} from "../utils/services";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";

export const GroupContext = createContext();

export const GroupContextProvider = ({ children }) => {
  const user = useContext(AuthContext);
  const currentUser = useMemo(() => user.user, [user]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io("http://localhost:3000");
      setSocket(newSocket);

      return () => {
        newSocket?.disconnect();
      };
    }
  }, [currentUser]);

  const [groupChats, setGroupChats] = useState([]);
  const [currentGroupChat, setCurrentGroupChat] = useState(null);
  const [groupMessages, setGroupMessages] = useState(null);
  const [newGroupMessage, setNewGroupMessage] = useState(null);

  const updateCurrentGroupChat = useCallback((group) => {
    setCurrentGroupChat(group);
  }, []);

  const createGroupChat = useCallback(async (members, groupName) => {
    // create new group
    if (groupName === "") {
      groupName = "group";
    }

    const response = await postRequest(
      `${baseUrl}/chat/group/create-group`,
      JSON.stringify({ members, groupName })
    );

    if (response.error) {
      return console.log("error creating chat", response);
    }

    setGroupChats((prev) => [...prev, response]);
  }, []);

  useEffect(() => {
    //fetch user groups
    const getUserGroups = async () => {
      if (currentUser) {
        const response = await getRequest(
          `${baseUrl}/chat/group/get-user-groups/${currentUser.userId}`
        );

        if (response.error) {
          return console.log("error creating chat", response);
        }

        setGroupChats(response);
      }
    };

    getUserGroups();
  }, [currentUser]);

  //edit group
  const editGroup = useCallback(
    async (groupName, membersToRemove, membersToAdd) => {
      const response = await patchRequest(
        `${baseUrl}/chat/group/edit-group/${currentGroupChat?._id}`,
        JSON.stringify({ groupName, membersToAdd, membersToRemove })
      );

      if (response.error) {
        return console.log("error editting group", response);
      }

      console.log(response);
      setGroupChats((prev) => [...prev, response]);
    },
    [currentGroupChat]
  );

  const sendGroupTextMessage = useCallback(
    async (groupTextMessage, sender, currentGroupId, setGroupTextMessage) => {
      if (!groupTextMessage) {
        console.log("type something ...");
      }

      const response = await postRequest(
        `${baseUrl}/message/group/create-group-message`,
        JSON.stringify({
          chatId: currentGroupId,
          senderId: sender.userId,
          text: groupTextMessage,
        })
      );
      if (response.error) {
        // return setSendMessageError(response);
        console.log("error sending group message", response.error);
        return;
      }

      setNewGroupMessage(response);
      setGroupMessages((prev) => [...prev, response]);

      setGroupTextMessage("");
    },
    []
  );

  useEffect(() => {
    const getGroupMessages = async () => {
      const response = await getRequest(
        `${baseUrl}/message/group/${currentGroupChat?._id}`
      );

      if (response.error) {
        // return setMessageError(response);
      }
      setGroupMessages(response);
    };

    getGroupMessages();
  }, [currentGroupChat, newGroupMessage]);

  // create new group for socket

  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket.emit("createNewGroup", { currentGroupChat });
  }, [currentGroupChat, socket]);

  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket.on("getGroups", (res) => {
      console.log(res);
    });
  }, [socket]);

  //send  group messages
  useEffect(() => {
    if (
      socket === null ||
      currentGroupChat === null ||
      newGroupMessage === null
    ) {
      return;
    }

    if (socket && currentGroupChat) {
      socket.emit("sendGroupMessage", {
        currentGroupChat,
        ...newGroupMessage,
      });
    }
  }, [currentGroupChat, newGroupMessage, socket]);

  useEffect(() => {
    if (
      socket === null ||
      currentGroupChat === null ||
      newGroupMessage === null
    ) {
      return;
    }
    socket.on("getGroupMessage", (res) => {
      const { newGroupMessage } = res;
      setGroupMessages((prevGroupMessages) => [
        ...prevGroupMessages,
        newGroupMessage,
      ]);
    });
  }, [socket, currentGroupChat, newGroupMessage]);



  return (
    <GroupContext.Provider
      value={{
        createGroupChat,
        groupChats,
        sendGroupTextMessage,
        updateCurrentGroupChat,
        currentGroupChat,
        groupMessages,
        editGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
