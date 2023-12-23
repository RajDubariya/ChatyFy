import PropTypes from "prop-types";
const UserGroups = ({ group, user }) => {
  return (
    <>
      <div className="border rounded-lg p-2 px-4 bg-gray-50 capitalize w-full cursor-pointer">
        <p className="font-semibold">
          {group?.groupName ? group?.groupName : "Group"}
        </p>
        <div className=" flex items-center flex-wrap w-full text-[0.65rem]">
          members :
          {group?.members?.map((member) => {
            return (
              <div
                key={member._id}
                className="ml-2 mt-0.5 border py-0.5 px-1 rounded-md bg-gray-50 text-gray-500"
              >
                <p>{member?._id === user?.userId ? "you" : member?.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UserGroups;

UserGroups.propTypes = {
  group: PropTypes.object.isRequired, // This specifies that handleButtonOnclick must be a function and is required.
  user: PropTypes.object.isRequired, // You can adjust the type and required status as needed.
};
