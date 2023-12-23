import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className="w-full relative inline-block text-left">
        <button
          onClick={toggleDropdown}
          className="px-4 py-2 w-full rounded-lg font-semibold text-gray-50 bg-sky-400 hover:bg-sky-500  capitalize"
        >
          Create new chat here
        </button>

        {isOpen && (
          <div className="w-full z-20 capitalize  origin-top-right absolute right-0 mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div>
              {potentialChats &&
                potentialChats.map((u, index) => {
                  return (
                    <div
                      className="p-2 border-b relative text-lg cursor-pointer"
                      key={index}
                      onClick={() => createChat(user?.userId, u?._id)}
                    >
                      {u.name}
                      <span
                        className={
                          onlineUsers?.some((user) => user?.userId === u?._id)
                            ? "bg-green-400 h-3 w-3 rounded-full absolute  top-[35%] right-2"
                            : ""
                        }
                      ></span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PotentialChats;
