import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useAppValue } from "../context";

const Container = styled.div`
  padding: 20px 40px 20px 20px;
`;

const Login = () => {
  const history = useHistory();
  const [{ user }] = useAppValue();
  useEffect(() => {
    if (user) {
      history.push(`/`);
    }
  });

  return (
    <Container>
      <div className="text">
        <h1>Login</h1>
        <em>Please login into your account!</em>
      </div>
      <LoginForm
        onDone={(values) => {
          history.push("/");
        }}
      />
    </Container>
  );
};

export default Login;
