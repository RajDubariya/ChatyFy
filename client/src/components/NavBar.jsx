import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";
const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <>
      <nav className=" w-full h-[9vh] border-b-2 flex items-center justify-around p-2 py-3">
        <div>
          <Link
            to={"/"}
            className=" text-sky-400 text-xl md:text-2xl font-pacifico p-2"
          >
            ChatyFy
          </Link>
        </div>
        <div>
          <span className=" text-green-300 capitalize text-xs md:text-base">
            {user ? `Logged in as ${user.name}` : ""}
          </span>
        </div>
        <div>
          {user ? (
            <div className=" flex items-center p-2 justify-center">
              <Notification />

              <Link
                className=" text-red-400 font-semibold text-xs md:text-base"
                onClick={() => logoutUser()}
                to={"/login"}
              >
                Logout
              </Link>
            </div>
          ) : (
            <div className=" text-black  text-sm md:text-base sm:text-base ">
              <Link
                className=" px-3 hover:text-sky-500 transition duration-200 ease-in-out"
                to={"/login"}
              >
                Login
              </Link>

              <Link
                className=" px-3 hover:text-sky-500 transition duration-200 ease-in-out"
                to={"/register"}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
