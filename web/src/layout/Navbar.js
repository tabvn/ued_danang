import React, { useState } from "react";
import { Row, Col, Avatar, Menu, Dropdown, Button } from "antd";
import { useAppValue } from "../context";
import _ from "lodash";
import styled from "styled-components";
import {
  AlignLeftOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  display: flex;
  height: 60px;
  padding: 10px 20px;
  .user-profile {
    float: right;
    display: flex;
    align-items: center;
  }
  .drop-down {
    width: 100%;
  }
  .user-name {
    margin-left: 5px;
  }
  .collapse-icon {
    width: 40px;
    .anticon svg {
      height: 30px;
      width: 30px;
    }
  }
`;

const Navbar = (props) => {
  const history = useHistory();
  const [{ user }, dispatch] = useAppValue();
  const [visible, setVisible] = useState();
  const handleCancel = () => {
    setVisible(false);
  };
  const menu = (
    <Menu>
      <Menu.Item>
        <a
          href="/#"
          onClick={(e) => {
            e.preventDefault();
            dispatch({
              type: "logout",
            });
            history.push("/login");
          }}
        >
          Log out
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <Container>
      <Row type="flex" style={{ width: "100%", alignItems: "center" }}>
        <Col
          span={14}
          lg={18}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              size="small"
              type="link"
              className="collapse-icon"
              style={{
                width: 59,
                paddingLeft: 5,
                border: "none",
              }}
              onClick={() => props.onClick(!props.collapsed)}
            >
              <AlignLeftOutlined />
            </Button>
            <Link to="/">
              UED
            </Link>
          </div>
        </Col>
        <Col span={10} lg={6} style={{ display: "flex", alignItems: "center", justifyContent: 'flex-end' }}>
          {user && (
            <div onClick={(e) => e.defaultPrevented} className="user-profile">
              <Dropdown overlay={menu} placement="bottomCenter">
                <div style={{ cursor: "pointer" }}>
                  <Avatar>
                    {user &&
                    _.first(user.firstName)}
                  </Avatar>
                </div>
              </Dropdown>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

Navbar.propTypes = {};

export default Navbar;
