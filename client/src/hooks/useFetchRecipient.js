import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members.find((id) => id !== user?.userId);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) {
        null;
      }
      if (recipientId) {
        const response = await getRequest(
          `${baseUrl}/users/find/${recipientId}`
        );

        if (response.error) {
          return setError(error);
        }

        setRecipientUser(response);
      }
    };
    getUser();
  }, [recipientId]);

  return { recipientUser };
};
