import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
<<<<<<< HEAD
    Button,
    Col,
    Form,
    Input,
    Modal,
    notification,
    PageHeader,
    Popconfirm,
    Row,
    Table,
=======
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  PageHeader,
  Popconfirm,
  Row,
  Table,
>>>>>>> 355f3367930ff582fa3ccf63c5ae048d7e578e82
} from "antd";
import moment from "moment";
import styled from "styled-components";

const adminUsersQuery = gql`
  query adminUsers($filter: AdminUserFilter) {
    adminUsers(filter: $filter) {
      total
      nodes {
        id
        firstName
        lastName
        email
        createdAt
      }
    }
  }
`;

const deleteUserMutation = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const createAdminUserMutation = gql`
  mutation createAdminUser($input: NewUser!) {
    createAdminUser(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

const updateUserMutation = gql`
mutation updateUser($id: ID!, $input: UpdateUserInput!){
  updateUser(id: $id, input: $input){
    id
    firstName
    lastName
    email
  }
}
`

const Container = styled.div`
  .actions {
    @media (min-width: 991px) {
      .delete-btn {
        margin-left: 10px;
      }
    }
  }
`;
const AdminUsers = () => {
<<<<<<< HEAD
    const [filter, setFilter] = useState({
        search: null,
        limit: 50,
        offset: 0,
    });
    const { data, loading, refetch } = useQuery(adminUsersQuery, {
        variables: {
            filter: { ...filter },
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [deleteUser] = useMutation(deleteUserMutation);
    const [visible, setVisible] = useState(false);
    const [edit, setEdit] = useState(null);
    const [createUser] = useMutation(createAdminUserMutation);
    const [updateUser] = useMutation(updateUserMutation);
    const [showPassword, setShowPassword] = useState(false)
    const columns = [
        {
            title: "Họ và tên",
            render: (text, record) => (
                <div>{`${record.lastName} ${record.firstName}`}</div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Khởi tạo ngày",
            render: (text, record) => (
                <div>{moment(record.createdAt).format("DD/MM/YYYY hh:mm:ss")}</div>
            ),
        },
        {
            title: "",
            render: (text, record) => (
                <div className="actions">
                    <Button
                        onClick={() => {
                            setEdit(record);
                            setVisible(true);
                        }}
                        size="small"
                    >
                        Sửa thông tin
                    </Button>
                    <Popconfirm
                        onConfirm={() => {
                            setIsLoading(true);
                            deleteUser({
                                variables: {
                                    id: record.id,
                                },
                            })
                                .then(() => {
                                    setIsLoading(false);
                                    refetch();
                                })
                                .catch((e) => {
                                    setIsLoading(false);
                                    if (
                                        e
                                            .toString()
                                            .includes(
                                                "there is only one administrator you could not delete it"
                                            )
                                    ) {
                                        notification.error({
                                            message:
                                                "Có lỗi xảy ra: chỉ còn lại duy nhất 1 quản trị viên bạn không thể xoá",
                                        });
                                    } else {
                                        notification.error({
                                            message: 'có lỗi xảy ra: ${e.toString()}',
                                        });
                                    }
                                });
                        }}
                        cancelText={"Không đồng ý"}
                        okText="Tôi đồng ý"
                        title={"Bạn có chắc chắn muốn xoá quản trị viên này"}
                    >
                        <Button
                            loading={isLoading}
                            className="delete-btn"
                            danger
                            size="small"
                        >
                            Xoá quản trị viên
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    return (
        <Container>
            <PageHeader title="Quản trị viên" />
            <Button
                onClick={() => {
                    setVisible(true);
                }}
            >
                Thêm quản trị viên
            </Button>
            <Table
                scroll={{ x: 720 }}
                pagination={{
                    current: page,
                    total: data ? data.adminUsers.total : 0,
                    pageSize: filter.limit,
                    showTotal: (total, range) => '${range}of ${total}',
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setFilter({ ...filter, offset: (page - 1) * pageSize });
                    },
                }}
                loading={loading}
                columns={columns}
                dataSource={data && data.adminUsers ? data.adminUsers.nodes : []}
            />
            {visible && (
                <Modal
                    okButtonProps={{
                        loading: isLoading,
                        form: "form",
                        htmlType: "submit",
                    }}
                    onCancel={() => {
                        setEdit(null);
                        setVisible(false);
                        setShowPassword(false)
                        setIsLoading(false)
                    }}
                    cancelText={"Huỷ"}
                    okText={"Lưu thông tin"}
                    visible={true}
                    title={edit ? "Sửa thông tin quản trị viên" : "Thêm quản trị viên"}
                >
                    <Form
                        initialValues={edit ? edit : null}
                        onFinish={(values) => {
                            setIsLoading(true);
                            if(!edit){
                                createUser({
                                    variables: {
                                        input: values,
                                    },
                                })
                                    .then(() => {
                                        refetch().then(() => {
                                            setVisible(false);
                                            setEdit(null);
                                            setIsLoading(false);
                                        });
                                    })
                                    .catch((e) => {
                                        setIsLoading(false);
                                        if (e.toString().includes("idx_users_email")) {
                                            notification.error({
                                                message: 'Có lỗi xảy ra: Địa chỉ email đã được dùng',
                                            });
                                        } else {
                                            notification.error({
                                                message: 'Có lỗi xảy ra: ${e.toString()}',
                                            });
                                        }
                                    });
                            }else{
                                // update user
                                updateUser({
                                    variables: {
                                        id: edit.id,
                                        input: values,
                                    },
                                })
                                    .then(() => {
                                        refetch().then(() => {
                                            setVisible(false);
                                            setEdit(null);
                                            setIsLoading(false);
                                        });
                                    })
                                    .catch((e) => {
                                        setIsLoading(false);
                                        if (e.toString().includes("idx_users_email")) {
                                            notification.error({
                                                message: 'Có lỗi xảy ra: Địa chỉ email đã được dùng',
                                            });
                                        } else {
                                            notification.error({
                                                message: 'Có lỗi xảy ra: ${e.toString()}',
                                            });
                                        }
                                    });
                            }

                        }}
                        id={"form"}
                        layout={"vertical"}
                    >
                        <Row gutter={15}>
                            <Col span={12}>
                                <Form.Item
                                    rules={[{ required: true, message: "Nhập họ" }]}
                                    name={"lastName"}
                                    label={"Họ"}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    rules={[{ required: true, message: "Nhập tên" }]}
                                    name={"firstName"}
                                    label={"Tên"}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            rules={[{ required: true, message: "Nhập email" }]}
                            name={"email"}
                            label={"Email"}
                        >
                            <Input type={"email"} />
                        </Form.Item>
                        {
                            edit &&  (
                                showPassword ? <Form.Item
                                    rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
                                    name={"password"}
                                    label={"Mật khẩu mới"}
                                >
                                    <Input.Password />
                                </Form.Item> : <Button onClick={() => setShowPassword(true)}>Đổi mật khẩu</Button>
                            )
                        }
                        {
                            !edit && (
                                <Form.Item
                                    rules={[{ required: true, message: "Nhập mật khẩu" }]}
                                    name={"password"}
                                    label={"Mật khẩu"}
                                >
                                    <Input.Password />
                                </Form.Item>
                            )
                        }
                    </Form>
                </Modal>
            )}
        </Container>
    );
};

export default AdminUsers;
=======
  const [filter, setFilter] = useState({
    search: null,
    limit: 50,
    offset: 0,
  });
  const { data, loading, refetch } = useQuery(adminUsersQuery, {
    variables: {
      filter: { ...filter },
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [deleteUser] = useMutation(deleteUserMutation);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(null);
  const [createUser] = useMutation(createAdminUserMutation);
  const [updateUser] = useMutation(updateUserMutation);
  const [showPassword, setShowPassword] = useState(false)
  const columns = [
    {
      title: "Họ và tên",
      render: (text, record) => (
        <div>{`${record.lastName} ${record.firstName}`}</div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Khởi tạo ngày",
      render: (text, record) => (
        <div>{moment(record.createdAt).format("DD/MM/YYYY hh:mm:ss")}</div>
      ),
    },
    {
      title: "",
      render: (text, record) => (
        <div className="actions">
          <Button
            onClick={() => {
              setEdit(record);
              setVisible(true);
            }}
            size="small"
          >
            Sửa thông tin
          </Button>
          <Popconfirm
            onConfirm={() => {
              setIsLoading(true);
              deleteUser({
                variables: {
                  id: record.id,
                },
              })
                .then(() => {
                  setIsLoading(false);
                  refetch();
                })
                .catch((e) => {
                  setIsLoading(false);
                  if (
                    e
                      .toString()
                      .includes(
                        "there is only one administrator you could not delete it"
                      )
                  ) {
                    notification.error({
                      message:
                        "Có lỗi xảy ra: chỉ còn lại duy nhất 1 quản trị viên bạn không thể xoá",
                    });
                  } else {
                    notification.error({
                      message: `có lỗi xảy ra: ${e.toString()}`,
                    });
                  }
                });
            }}
            cancelText={"Không đồng ý"}
            okText="Tôi đồng ý"
            title={"Bạn có chắc chắn muốn xoá quản trị viên này"}
          >
            <Button
              loading={isLoading}
              className="delete-btn"
              danger
              size="small"
            >
              Xoá quản trị viên
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <Container>
      <PageHeader title="Quản trị viên" />
      <Button
        onClick={() => {
          setVisible(true);
        }}
      >
        Thêm quản trị viên
      </Button>
      <Table
        scroll={{ x: 720 }}
        pagination={{
          current: page,
          total: data ? data.adminUsers.total : 0,
          pageSize: filter.limit,
          showTotal: (total, range) => `${range}of ${total}`,
          onChange: (page, pageSize) => {
            setPage(page);
            setFilter({ ...filter, offset: (page - 1) * pageSize });
          },
        }}
        loading={loading}
        columns={columns}
        dataSource={data && data.adminUsers ? data.adminUsers.nodes : []}
      />
      {visible && (
        <Modal
          okButtonProps={{
            loading: isLoading,
            form: "form",
            htmlType: "submit",
          }}
          onCancel={() => {
            setEdit(null);
            setVisible(false);
            setShowPassword(false)
            setIsLoading(false)
          }}
          cancelText={"Huỷ"}
          okText={"Lưu thông tin"}
          visible={true}
          title={edit ? "Sửa thông tin quản trị viên" : "Thêm quản trị viên"}
        >
          <Form
            initialValues={edit ? edit : null}
            onFinish={(values) => {
              setIsLoading(true);
              if(!edit){
                createUser({
                  variables: {
                    input: values,
                  },
                })
                    .then(() => {
                      refetch().then(() => {
                        setVisible(false);
                        setEdit(null);
                        setIsLoading(false);
                      });
                    })
                    .catch((e) => {
                      setIsLoading(false);
                      if (e.toString().includes("idx_users_email")) {
                        notification.error({
                          message: `Có lỗi xảy ra: Địa chỉ email đã được dùng`,
                        });
                      } else {
                        notification.error({
                          message: `Có lỗi xảy ra: ${e.toString()}`,
                        });
                      }
                    });
              }else{
                // update user
                  updateUser({
                      variables: {
                          id: edit.id,
                          input: values,
                      },
                  })
                      .then(() => {
                          refetch().then(() => {
                              setVisible(false);
                              setEdit(null);
                              setIsLoading(false);
                          });
                      })
                      .catch((e) => {
                          setIsLoading(false);
                          if (e.toString().includes("idx_users_email")) {
                              notification.error({
                                  message: `Có lỗi xảy ra: Địa chỉ email đã được dùng`,
                              });
                          } else {
                              notification.error({
                                  message: `Có lỗi xảy ra: ${e.toString()}`,
                              });
                          }
                      });
              }

            }}
            id={"form"}
            layout={"vertical"}
          >
            <Row gutter={15}>
              <Col span={12}>
                <Form.Item
                  rules={[{ required: true, message: "Nhập họ" }]}
                  name={"lastName"}
                  label={"Họ"}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[{ required: true, message: "Nhập tên" }]}
                  name={"firstName"}
                  label={"Tên"}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              rules={[{ required: true, message: "Nhập email" }]}
              name={"email"}
              label={"Email"}
            >
              <Input type={"email"} />
            </Form.Item>
            {
              edit &&  (
                  showPassword ? <Form.Item
                      rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
                      name={"password"}
                      label={"Mật khẩu mới"}
                  >
                    <Input.Password />
                  </Form.Item> : <Button onClick={() => setShowPassword(true)}>Đổi mật khẩu</Button>
              )
            }
            {
              !edit && (
                  <Form.Item
                      rules={[{ required: true, message: "Nhập mật khẩu" }]}
                      name={"password"}
                      label={"Mật khẩu"}
                  >
                    <Input.Password />
                  </Form.Item>
              )
            }
          </Form>
        </Modal>
      )}
    </Container>
  );
};

export default AdminUsers;
>>>>>>> 355f3367930ff582fa3ccf63c5ae048d7e578e82
