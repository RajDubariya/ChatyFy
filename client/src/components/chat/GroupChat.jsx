import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { IoClose } from "react-icons/io5";
import { GroupContext } from "../../context/GroupContext";

const GroupChat = () => {
  const { user } = useContext(AuthContext);
  const { allUsers } = useContext(ChatContext);
  const { createGroupChat } = useContext(GroupContext);

  //excluding loggedin user
  const filteredUsers = allUsers.filter((u) => u._id !== user.userId);

  const [groupMembers, setGroupMembers] = useState([user.userId]);
  const [groupName, setGroupName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const addMembersToGroup = (userId) => {
    if (groupMembers.includes(userId)) {
      setGroupMembers((prevMembers) =>
        prevMembers.filter((id) => id !== userId)
      );
    } else {
      setGroupMembers((prevMembers) => [...prevMembers, userId]);
    }
  };

  const handleCreateGroupChat = () => {
    setGroupMembers((prev) => [...prev, user.userId]);

    createGroupChat(groupMembers, groupName);

    //reset states
    setGroupMembers([user.userId]);
    setGroupName("");
    setIsModalOpen(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);

    setGroupMembers([user.userId]);
    setGroupName("");
  };

  return (
    <div>
      <button
        className="px-4 py-2 w-full rounded-lg mt-2 font-semibold text-gray-50 bg-sky-400 hover:bg-sky-500 capitalize"
        onClick={toggleModal}
      >
        create new group
      </button>
      {isModalOpen ? (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 ">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50"></div>
          <div className="relative bg-white p-2  w-[90%] md:w-[30%] shadow-lg rounded-xl">
            <div className="p-2 text-sky-500 border-b">
              <h2 className=" capitalize text-lg md:text-2xl">
                create new group
              </h2>

              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={toggleModal}
              >
                <IoClose size={25} />
              </button>
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Group Name Here..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required={true}
                className="w-full border-2 p-2 rounded-lg focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div>
              <p className="capitalize px-1.5 py-2 text-sm text-gray-500">
                please select members
              </p>
              {filteredUsers &&
                filteredUsers.map((u, index) => {
                  return (
                    <div
                      className="px-2 py-3 border-b  relative text-base w-full capitalize rounded-lg flex items-center justify-between"
                      key={index}
                    >
                      {u.name}
                      <input
                        type="checkbox"
                        checked={groupMembers.includes(u._id)}
                        onChange={() => addMembersToGroup(u._id)}
                        className="h-3.5 w-3.5 accent-sky-400 "
                      />
                    </div>
                  );
                })}
            </div>
            <div>
              <button
                className="px-4 py-2 w-full rounded-lg mt-2 font-semibold text-gray-50 bg-sky-400 hover:bg-sky-500 capitalize"
                onClick={handleCreateGroupChat}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GroupChat;
