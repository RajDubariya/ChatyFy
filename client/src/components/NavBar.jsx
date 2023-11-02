import { useContext } from "react";

import { Nav, Container, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";
const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <>
      <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
        <Container>
          <h2>
            <Link
              to={"/"}
              className="link-height text-decoration-none text-white"
            >
              Chatt--
            </Link>
          </h2>
          <span className="text-success">
            {user ? `Logged in as ${user.name}` : ""}
          </span>

          <Nav>
            <Stack direction="horizontal" gap={4}>
              {user ? (
                <>
                  <Notification />
                  <Link
                    onClick={() => logoutUser()}
                    to={"/login"}
                    className="link-height text-decoration-none text-light"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={"/login"}
                    className="link-height text-decoration-none text-light"
                  >
                    Login
                  </Link>

                  <Link
                    to={"/register"}
                    className="link-height text-decoration-none text-light"
                  >
                    Register
                  </Link>
                </>
              )}
            </Stack>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
