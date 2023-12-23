import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/chat/UserChat";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";
import conversation from "../assets/conversation.svg";
import GroupChat from "../components/chat/GroupChat";
import UserGroups from "../components/chat/UserGroups";
import GroupChatBox from "../components/chat/GroupChatBox";
import { GroupContext } from "../context/GroupContext";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat } =
    useContext(ChatContext);
  const { groupChats, updateCurrentGroupChat } = useContext(GroupContext);

  const [showChatbox, setShowChatbox] = useState(false);

  const [isGroupChat, setIsGroupChat] = useState(false);

  const handleRecentChatClick = (chat) => {
    updateCurrentChat(chat);
    setShowChatbox(true);
    setIsGroupChat(false);
  };
  const handleRecentGroupClick = (group) => {
    updateCurrentGroupChat(group);
    setShowChatbox(true);
    setIsGroupChat(true);
  };

  const handleButtonOnclick = () => {
    setShowChatbox(false);
  };

  return (
    <div className="p-4 h-[90vh] flex gap-5">
      <div
        className={`w-full flex-col md:w-[30%] ${
          showChatbox ? "hidden" : ""
        } md:flex`}
      >
        <PotentialChats />

        <p className=" text-lg mt-2 capitalize">Recent chats</p>
        {userChats?.length < 1 ? null : (
          <div className="mt-2">
            <div className="w-full">
              {isUserChatsLoading && <p>loading chats</p>}
              {userChats?.map((chat, index) => {
                return (
                  <div key={index} onClick={() => handleRecentChatClick(chat)}>
                    <UserChat chat={chat} user={user} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* groups */}
        <GroupChat />
        <p className="text-lg mt-2 capitalize">your groups</p>
        {groupChats &&
          groupChats?.map((group, index) => {
            return (
              <div
                key={index}
                className="mt-2"
                onClick={() => handleRecentGroupClick(group)}
              >
                <UserGroups group={group} user={user} />
              </div>
            );
          })}
      </div>

      {showChatbox ? (
        <div className={`w-full md:w-[70%]`}>
          {isGroupChat ? (
            <GroupChatBox
              user={user}
              handleButtonOnclick={handleButtonOnclick}
            />
          ) : (
            <ChatBox user={user} handleButtonOnclick={handleButtonOnclick} />
          )}
        </div>
      ) : (
        <div className="hidden md:flex h-[80vh] w-[70%] capitalize flex-col items-center justify-center">
          <p>please Select a chat or group ...</p>
          <img src={conversation} className="h-80" />
        </div>
      )}
    </div>
  );
};

export default Chat;
