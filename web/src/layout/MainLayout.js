import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import index from "../routers/index";
import { Drawer } from "antd";

const MOBILE_WIDTH = 991;

const Container = styled.div`
  position: relative;
  .header {
    box-shadow: rgb(21, 27, 38) 0px 0px 10px -5px;
    position: fixed;
    background: white;
    width: 100%;
    z-index: 1;
  }
  .content {
    display: grid;
    grid-template-columns: ${(props) =>
      props.width < MOBILE_WIDTH
        ? "100%"
        : props.collapsed === true
        ? "79px calc(100% - 79px)"
        : "256px calc(100% - 256px)"};
    height: 100%;
    padding-top: 60px;
  }
  .main-content {
    background: #f9f9f9;
  }
`;

const MainLayout = (props) => {
  const [collapsed, changeCollapsed] = useState(false);
  useEffect(() => {}, [collapsed]);
  const location = props.children.props.location;
  const changeSize = window.innerWidth > MOBILE_WIDTH;
  return (
    <Container collapsed={collapsed} width={window.innerWidth}>
      <div className="header">
        <Navbar
          collapsed={collapsed}
          onClick={(values) => changeCollapsed(values)}
        />
      </div>
      <div className="content">
        {changeSize ? (
          <SideBar
            className="side-bar"
            collapsed={collapsed}
            routes={index}
            location={location}
            changeSize={changeSize}
          />
        ) : (
          <Drawer
            bodyStyle={{
              padding: 0,
            }}
            visible={collapsed}
            placement="left"
            closable={false}
            maskClosable={true}
            onClose={() => changeCollapsed()}
          >
            <SideBar
              collapsed={null}
              className="side-bar"
              routes={index}
              location={location}
              changeSize={changeSize}
            />
          </Drawer>
        )}
        <div className="main-content">
          <div style={{ padding: 20, overflowX: "auto" }}>{props.children}</div>
        </div>
      </div>
    </Container>
  );
};

MainLayout.propTypes = {};

export default MainLayout;
