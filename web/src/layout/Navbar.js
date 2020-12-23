import React, { useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  notification,
  Row,
} from "antd";
import { useAppValue } from "../context";
import _ from "lodash";
import styled from "styled-components";
import { AlignLeftOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

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

const changePasswordMutation = gql`
  mutation changePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword)
  }
`;
const Navbar = (props) => {
  const history = useHistory();
  const [{ user }, dispatch] = useAppValue();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changePassword] = useMutation(changePasswordMutation);
  const menu = (
    <Menu style={{ minWidth: 200 }}>
      <Menu.Item onClick={() => setVisible(true)}>
        <a>Đổi mật khẩu</a>
      </Menu.Item>
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
          Thoát
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
            <Link to="/">UED</Link>
          </div>
        </Col>
        <Col
          span={10}
          lg={6}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {user && (
            <Dropdown trigger={["click"]} overlay={menu} placement="bottomCenter">
              <div onClick={(e) => e.defaultPrevented} className="user-profile">
                <Button type="link"
                  style={{ marginRight: 10 }}
                >{`${user.lastName} ${user.firstName}`}</Button>

                <div style={{ cursor: "pointer" }}>
                  <Avatar>{user && _.first(user.firstName)}</Avatar>
                </div>
              </div>
            </Dropdown>
          )}
        </Col>
      </Row>
      <Modal
        okButtonProps={{
          form: "changePasswordForm",
          key: "submit",
          htmlType: "submit",
          loading: loading,
        }}
        onCancel={() => setVisible(false)}
        cancelText={"Huỷ"}
        okText={"Đồng ý"}
        visible={visible}
        title={"Đổi mật khẩu"}
      >
        <Form
          onFinish={(values) => {
            setLoading(true);
            changePassword({
              variables: {
                newPassword: values.password,
              },
            })
              .then(() => {
                setLoading(false);
                setVisible(false);
                notification.success({ message: "Đổi mật khẩu thành công" });
              })
              .catch((e) => {
                notification.error({
                  message: `Có lỗi xảy ra: ${e.toString()}`,
                });
              });
          }}
          id="changePasswordForm"
          layout={"vertical"}
        >
          <Form.Item
            label={"Mật khẩu mới"}
            name="password"
            rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu mới"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Hãy xác nhận mật khẩu mới",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Mật khẩu và xác nhận mật khẩu không giống nhau"
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

Navbar.propTypes = {};

export default Navbar;
