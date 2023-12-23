import PropTypes from "prop-types";
import moment from "moment";
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
      <div
        className="bg-gray-50 border border-gray-200 rounded-xl cursor-pointer mb-2 p-2.5 relative"
        onClick={() => {
          if (thisUserNotifications?.length !== 0) {
            markThisUsersNotificationAsRead(
              thisUserNotifications,
              notifications
            );
          }
        }}
      >
        <div className="flex capitalize">
          <div className=" me-2">
            <img src={avatar} className="w-10 " />
          </div>
          <div className=" text-sm">
            <div>{recipientUser?.name}</div>
            <div className=" text-xs">{truncateText(latestMessage?.text)}</div>
          </div>
        </div>

        <div className="flex  items-center mt-1">
          <div className="text-xs text-gray-400">
            {moment(latestMessage?.createdAt).calendar()}
          </div>
          <div
            className={
              thisUserNotifications?.length > 0
                ? ` bg-sky-300 text-white text-xs h-4 w-4 rounded-full flex justify-center items-center ml-auto`
                : ""
            }
          >
            {thisUserNotifications?.length > 0
              ? thisUserNotifications?.length
              : ""}
          </div>
          <span
            className={
              onlineUsers?.some((user) => user?.userId === recipientUser?._id)
                ? " bg-green-400 h-3 w-3 rounded-full absolute  top-[-4.5px] right-[-4.5px]"
                : ""
            }
          ></span>
        </div>
      </div>
    </>
  );
};

export default UserChat;

UserChat.propTypes = {
  chat: PropTypes.object.isRequired, // This specifies that handleButtonOnclick must be a function and is required.
  user: PropTypes.object.isRequired, // You can adjust the type and required status as needed.
};
