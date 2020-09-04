import React from "react";
import { Spin } from "antd";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`;
const AppSpin = () => {
  return (
    <Container>
      <Spin />
    </Container>
  );
};

export default AppSpin;
