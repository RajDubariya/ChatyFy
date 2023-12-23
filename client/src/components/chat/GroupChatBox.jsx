import moment from "moment";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { IoArrowBack, IoSend } from "react-icons/io5";
import InputEmoji from "react-input-emoji";
import chatImage from "../../assets/chat.svg";
import { GroupContext } from "../../context/GroupContext";
import EditGroup from "./EditGroup";

const GroupChatBox = ({ user, handleButtonOnclick }) => {
  const { currentGroupChat, sendGroupTextMessage, groupMessages } =
    useContext(GroupContext);
  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages]);
  return (
    <>
      <div className={`border w-full  h-fit rounded-xl `}>
        <div className="flex items-center justify-center border-b p-2 capitalize rounded-t-2xl bg-gray-50 text-lg relative">
          <button
            onClick={handleButtonOnclick}
            className={`md:hidden absolute left-3`}
          >
            <IoArrowBack size={20} />
          </button>
          <p>{currentGroupChat?.groupName}</p>
          <div className="absolute right-3 ">
            {/* <EditGroup /> */}
          </div>
        </div>

        <div className="h-[calc(100vh-15rem)] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {groupMessages.length > 0 ? (
            groupMessages.map((msg, index) => (
              <div
                ref={scroll}
                key={index}
                className={`flex flex-col p-0.5 px-4 border mb-2 w-fit rounded-lg ${
                  msg?.senderId?._id === user?.userId
                    ? "bg-sky-400 ml-auto text-white text-end"
                    : ""
                }`}
              >
                <p
                  className={` capitalize text-xs  ${
                    msg?.senderId?._id === user?.userId
                      ? " text-gray-200"
                      : "text-gray-400"
                  }`}
                >
                  {msg?.senderId?._id === user?.userId
                    ? "you"
                    : msg?.senderId?.name}
                </p>
                <span>{msg?.text}</span>
                <span
                  className={`text-[0.65rem] ${
                    msg?.senderId?._id === user?.userId
                      ? " text-gray-100"
                      : "text-gray-400"
                  }`}
                >
                  {moment(msg?.createdAt).calendar()}
                </span>
              </div>
            ))
          ) : (
            <div className=" h-full flex flex-col justify-center items-center capitalize ">
              <img src={chatImage} className="h-80" />
              <p>no messages yet...</p>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center border-t p-3">
          <InputEmoji
            value={textMessage}
            onChange={setTextMessage}
            borderColor="rgba(72,112,223,0.2)"
          />

          <button
            className="h-11 w-11 ml-5 flex items-center justify-center bg-sky-300 p-2 rounded-full text-white hover:bg-sky-400"
            onClick={() =>
              sendGroupTextMessage(
                textMessage,
                user,
                currentGroupChat._id,
                setTextMessage
              )
            }
          >
            <IoSend size={25} />
          </button>
        </div>
      </div>
    </>
  );
};

export default GroupChatBox;

GroupChatBox.propTypes = {
  handleButtonOnclick: PropTypes.func.isRequired, // This specifies that handleButtonOnclick must be a function and is required.
  user: PropTypes.object.isRequired, // You can adjust the type and required status as needed.
};
