import moment from "moment";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { IoArrowBack, IoSend } from "react-icons/io5";
import InputEmoji from "react-input-emoji";
import chatImage from "../../assets/chat.svg";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";

const ChatBox = ({ handleButtonOnclick, user }) => {
  const {
    onlineUsers,
    currentChat,
    messages,
    isMessageLoading,
    sendTextMessage,
  } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipient(currentChat, user);

  const [textMessage, setTextMessage] = useState("");

  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessageLoading) {
    return (
      <p className=" text-black flex items-center justify-center h-full">
        Loading messages...
      </p>
    );
  }

  return (
    <>
      {recipientUser && (
        <div className={`border w-full  h-fit rounded-xl `}>
          <div className="flex items-center justify-center border-b p-2 capitalize rounded-t-2xl bg-gray-50 text-lg relative">
            <button
              onClick={handleButtonOnclick}
              className={`md:hidden absolute left-3`}
            >
              <IoArrowBack size={20} />
            </button>
            <p>{recipientUser?.name}</p>
            <div className="md:hidden block">
              <div
                className={
                  onlineUsers?.some(
                    (user) => user?.userId === recipientUser?._id
                  )
                    ? "bg-green-400 h-2.5 w-2.5 rounded-full absolute top-[40%] right-3"
                    : ""
                }
              ></div>
            </div>
          </div>

          <div className="h-[calc(100vh-15rem)] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  ref={scroll}
                  key={index}
                  className={`flex flex-col p-2 px-4 border mb-2 w-fit rounded-lg ${
                    msg?.senderId === user?.userId
                      ? "bg-sky-400 ml-auto text-white text-end"
                      : ""
                  }`}
                >
                  <span>{msg?.text}</span>
                  <span
                    className={`text-xs ${
                      msg?.senderId === user?.userId
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
                sendTextMessage(
                  textMessage,
                  user,
                  currentChat?._id,
                  setTextMessage
                )
              }
            >
              <IoSend size={25} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;

ChatBox.propTypes = {
  handleButtonOnclick: PropTypes.func.isRequired, // This specifies that handleButtonOnclick must be a function and is required.
  user: PropTypes.object.isRequired, // You can adjust the type and required status as needed.
};
