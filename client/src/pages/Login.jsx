import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { loginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading } =
    useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginError = (error) => {
    toast.error(error.message);
  };

  return (
    <>
      <div className="h-[90vh] w-full flex items-center justify-center p-4 ">
        <div className=" p-4 rounded-xl border border-gray-100 w-96 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center text-black">
            Login
          </h2>

          <form onSubmit={loginUser}>
            <div className="mb-4 ">
              <label
                htmlFor="email"
                className="block mb-2 text-xs md:text-sm font-medium text-gray-500"
              >
                Your email
              </label>
              <input
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-sky-400 block w-full p-2 md:p-2.5 "
                placeholder="example@email.com"
              />
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block mb-2 text-xs md:text-sm font-medium text-gray-500"
              >
                Your Password
              </label>
              <input
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, password: e.target.value })
                }
                type={showPassword ? "text" : "password"}
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-sky-400 block w-full  p-2 md:p-2.5 relative "
                placeholder="**********"
              />

              {showPassword ? (
                <AiFillEyeInvisible
                  onClick={toggleShowPassword}
                  size={21}
                  color="black"
                  className="absolute top-9 md:top-10 right-2"
                />
              ) : (
                <AiFillEye
                  onClick={toggleShowPassword}
                  size={21}
                  color="black"
                  className="absolute top-9 md:top-10 right-2"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-sky-400 text-white py-2 px-4 mb-3 rounded-lg transition duration-300  ease-in-out hover:bg-sky-500 focus:outline-none focus:ring focus:ring-sky-blue-300"
            >
              {isLoginLoading ? "Logging you in..." : "Login"}
            </button>

            <Link
              to={"/register"}
              className="  text-gray-500 text-xs underline capitalize hover:text-gray-400 flex "
            >
              Create a new account here
              <span>
                <HiOutlineArrowSmRight size={18} />
              </span>
            </Link>
          </form>
        </div>
      </div>
      {loginError && handleLoginError(loginError)}
    </>
  );
};

export default Login;
