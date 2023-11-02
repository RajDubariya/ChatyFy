import moment from "moment";
import send from "../../assets/sendbutton.png";
import InputEmoji from "react-input-emoji";
import { useContext, useState, useRef, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessageLoading, sendTextMessage } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipient(currentChat, user);
  const [textMessage, setTextMessage] = useState("");

  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!recipientUser) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        Select a conversation ...
      </p>
    );
  }
  if (isMessageLoading) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loding messages ...</p>
    );
  }
  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
      </div>

      <Stack gap={3} className="messages">
        {messages &&
          messages.map((msg, index) => (
            <Stack
              ref={scroll}
              key={index}
              className={`${
                msg?.senderId === user?.userId
                  ? "message self align-self-end flex-grow-0"
                  : "message  align-self-start flex-grow-0"
              }`}
            >
              <span>{msg?.text}</span>
              <span className="message-footer">
                {moment(msg?.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>

      <Stack gap={3} className="chat-input flex-grow-0" direction="horizontal">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          borderColor="rgba(72,112,223,0.2)"
        />
        <button
          className="send-btn"
          onClick={() =>
            sendTextMessage(textMessage, user, currentChat?._id, setTextMessage)
          }
        >
          <img src={send} height={30} />
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
