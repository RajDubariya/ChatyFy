import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatestMessage = (chat) => {
  const { newMessge, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      const response = await getRequest(`${baseUrl}/message/${chat?._id}`);

      if (response.error) {
        return console.log("error getting messages...", response);
      }
      const lastMessage = response[response?.length - 1];

      setLatestMessage(lastMessage);
    };
    getMessages();
  }, [newMessge, notifications]);
  return { latestMessage };
};
