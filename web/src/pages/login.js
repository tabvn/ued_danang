import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useAppValue } from "../context";

const Container = styled.div`
  padding: 20px 40px 20px 20px;
  max-width: 500px;
  margin: 0 auto;
  .form{
    margin-top: 30px;
   }
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
      <div className={"form"}>
          <div className="text">
              <h1>Đăng nhập tài khoản</h1>
          </div>
          <LoginForm
              onDone={(values) => {
                  history.push("/");
              }}
          />
      </div>
    </Container>
  );
};

export default Login;
