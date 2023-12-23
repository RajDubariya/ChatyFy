import { useContext, useState } from "react";
import moment from "moment";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { IoIosNotifications } from "react-icons/io";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationsAsRead,
    markANotificationAsRead,
  } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);

  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.name,
    };
  });

  return (
    <div>
      <div
        className=" relative px-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoIosNotifications color="black" size={28} />
        {unreadNotifications?.length === 0 ? null : (
          <span className=" absolute top-[-5px] right-3 bg-sky-300 rounded-full h-4 w-4 flex items-center justify-center">
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>
      {isOpen ? (
        <div className=" border rounded-md bg-gray-50 absolute h-fit w-[300px] right-10 top-[4.5rem] z-10">
          <div className=" flex w-full justify-between p-2 border-b">
            <h3>Notifications</h3>

            <div
              className=" cursor-pointer opacity-80"
              onClick={() => markAllNotificationsAsRead(notifications)}
            >
              Mark all read
            </div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <p className=" text-center p-2">No notifications yet...</p>
          ) : null}
          {modifiedNotifications &&
            modifiedNotifications.map((n, index) => {
              return (
                <div
                  key={index}
                  className={` border-b py-1 px-2 flex flex-col cursor-pointer ${
                    n.isRead ? "" : "bg-sky-50"
                  }`}
                  onClick={() => {
                    markANotificationAsRead(n, userChats, user, notifications);
                    setIsOpen(false);
                  }}
                >
                  <span>{`${n.senderName} sent you a message`}</span>
                  <span className="text-xs">{`${moment(
                    n.date
                  ).calendar()}`}</span>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
