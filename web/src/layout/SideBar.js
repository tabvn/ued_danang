import React from "react";
import { Menu } from "antd";
import styled from "styled-components";
import SubMenu from "antd/lib/menu/SubMenu";
import _ from "lodash";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 256px;
  position: relative;
  height: calc(100vh - 60px);
  .setting-menu {
    position: fixed;
    height: ${(props) =>
      props.changeSize === false ? "100vh" : "calc(100vh - 60px)"};
    width: ${(props) =>
      props.collapsed
        ? props.collapsed === false
          ? "256px"
          : "80px"
        : "256px"};
  }
`;

const SideBar = (props) => {
  const { location, routes, collapsed, changeSize } = props;
  const childMenu = _.filter(routes, (menu) => {
    return menu.child;
  });
  const defaultOpenKeys = _.filter(childMenu, (children) => {
    return _.find(children.child, (childRouter) => {
      return childRouter.path === location.pathname;
    });
  });
  return (
    <Container collapsed={collapsed} changeSize={changeSize}>
      Menu
    </Container>
  );
};

SideBar.propTypes = {};

export default SideBar;
