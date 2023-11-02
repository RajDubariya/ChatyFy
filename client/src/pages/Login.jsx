import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { loginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading } =
    useContext(AuthContext);
  return (
    <Form onSubmit={loginUser}>
      <Row
        style={{
          height: "85vh",
          justifyContent: "center",
          paddingTop: "15%",
        }}
      >
        <Col xs={6}>
          <Stack gap={3}>
            <h2 className="text-center">Login </h2>
            <Form.Control
              type="text"
              placeholder="Email"
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, email: e.target.value })
              }
            />
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, password: e.target.value })
              }
            />
            <Button type="submit">
              {isLoginLoading ? "Logging you in..." : "Login"}
            </Button>

            {loginError?.error && (
              <Alert variant="danger text-center">
                <p>{loginError?.message}</p>
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;
