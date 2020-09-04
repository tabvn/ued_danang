import React from "react";
import styled from "styled-components";

const Container = styled.div``
const LoginLayout = (props) => {
    return (
        <Container className="hello">
            {props.children}
        </Container>
    );
};

export default LoginLayout;
