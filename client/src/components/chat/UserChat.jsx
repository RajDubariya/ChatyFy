/* eslint-disable react/prop-types */
import moment from "moment";
import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.png";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers, notifications, markThisUsersNotificationAsRead } =
    useContext(ChatContext);

  const { latestMessage } = useFetchLatestMessage(chat);

  const unreadNotifications = unreadNotificationsFunc(notifications);

  const thisUserNotifications = unreadNotifications?.filter((n) => {
    return n.senderId === recipientUser?._id;
  });
  const truncateText = (text) => {
    if (text) {
      let shortText = text.substring(0, 20);
      if (shortText.length > 20) {
        shortText = shortText + "...";
      }
      return shortText;
    }
  };
  return (
    <>
      <Stack
        direction="horizontal"
        gap={3}
        className="user-card align-items-center p-2 justify-content-between"
        role="button"
        onClick={() => {
          if (thisUserNotifications?.length !== 0) {
            markThisUsersNotificationAsRead(
              thisUserNotifications,
              notifications
            );
          }
        }}
      >
        <div className="d-flex">
          <div className="me-2">
            <img src={avatar} height={40} />
          </div>
          <div className="text-center">
            <div className="name">{recipientUser?.name}</div>
            <div className="text">{truncateText(latestMessage?.text)}</div>
          </div>
        </div>

        <div className="d-flex flex-column align-items-end">
          <div className="date">
            {moment(latestMessage?.createdAt).calendar()}
          </div>
          <div
            className={
              thisUserNotifications?.length > 0 ? `this-user-notifications` : ""
            }
          >
            {thisUserNotifications?.length > 0
              ? thisUserNotifications?.length
              : ""}
          </div>
          <span
            className={
              onlineUsers?.some((user) => user?.userId === recipientUser?._id)
                ? "user-online"
                : ""
            }
          ></span>
        </div>
      </Stack>
    </>
  );
};

export default UserChat;
