import React from "react";
import { Menu } from "antd";
import styled from "styled-components";
import _ from "lodash";
import { Link } from "react-router-dom";

const {SubMenu} = Menu
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
  //const customizeIndicator = <AngleDown />;
  return (
    <Container collapsed={collapsed} changeSize={changeSize}>
      <Menu
        className="setting-menu"
        mode="inline"
        inlineCollapsed={collapsed}
        //overflowedIndicator={customizeIndicator}
        defaultOpenKeys={
          defaultOpenKeys.length > 0
            ? [defaultOpenKeys[0].path]
            : defaultOpenKeys
        }
        selectedKeys={[location.pathname]}
      >
        {routes.map((route) =>
          route.layout && route.title ? (
            route.child ? (
              <SubMenu key={route.path} icon={route.icon} title={route.title}>
                {route.child.map((children) =>
                  children.child ? (
                    <SubMenu key={children.path} title={children.title}>
                      {children.child.map((minichild) => (
                        <Menu.Item key={minichild.path}>
                          <Link to={minichild.path}>{minichild.title}</Link>
                        </Menu.Item>
                      ))}
                    </SubMenu>
                  ) : (
                    <Menu.Item key={children.path}>
                      <Link to={children.path}>{children.title}</Link>
                    </Menu.Item>
                  )
                )}
              </SubMenu>
            ) : route.path === "/settings" ? (
              <Menu.Item
                key={route.path}
                icon={route.icon}
                style={{ position: "absolute", bottom: -5 }}
              >
                <Link to={route.path}>{route.title}</Link>
              </Menu.Item>
            ) : (
              <Menu.Item
                //overflowedIndicator={customizeIndicator}
                key={route.path}
                icon={route.icon}
              >
                <Link to={route.path}>{route.title}</Link>
              </Menu.Item>
            )
          ) : null
        )}
      </Menu>
    </Container>
  );
};

SideBar.propTypes = {};

export default SideBar;
