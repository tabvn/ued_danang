import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Form, Input, notification, Table } from "antd";
import { GET_ALL_TEACHERS } from "../../graphqls/query/teachers";

const createTeacherMutation = gql`
  mutation createTeacher($input: TeacherInput!) {
    createTeacher(input: $input) {
      id
      firstName
      lastName
      phone
    }
  }
`;

const updateTeacherMutation = gql`
  mutation updateTeacher($id: ID!, $input: UpdateTeacherInput!) {
    updateTeacher(id: $id, input: $input) {
      id
      firstName
      lastName
    }
  }
`;
const ListTeachers = () => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    limit: 50,
    offset: 0,
  });
  const { loading, error, data, refetch } = useQuery(GET_ALL_TEACHERS, {
    variables: {
      filter: { ...filter },
    },
  });

  const [createTeacher] = useMutation(createTeacherMutation);
  const [updateTeacher] = useMutation(updateTeacherMutation);
  const [update, setUpdate] = useState(null);
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return <div>{`${record.lastName} ${record.firstName}`}</div>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => <div>{record.user.email}</div>,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text, record) => {
        return <div>{record.phone}</div>;
      },
    },
    {
      title: "Nơi công tác",
      dataIndex: "workPlace",
      key: "workPlace",
      render: (text, record) => {
        return <div>{record.workPlace}</div>;
      },
    },
    {
      title: "",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            onClick={() => {
              setUpdate(record);
            }}
            size={"small"}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={() => setVisible(true)}>Thêm giảng viên</Button>
      <Table
        scroll={{ x: 1200 }}
        pagination={{
          current: page,
          total: data ? data.teachers.total : 0,
          pageSize: filter.limit,
          showTotal: (total, range) => `${range}of ${total}`,
          onChange: (page, pageSize) => {
            setPage(page);
            setFilter({ ...filter, offset: (page - 1) * pageSize });
          },
        }}
        dataSource={data ? data.teachers.nodes : []}
        columns={columns}
      />
      <Drawer
        onClose={() => setVisible(false)}
        title={"Thêm giảng viên"}
        placement="right"
        width={window.innerWidth < 520 ? window.innerWidth : 520}
        visible={visible}
      >
        <Form
          layout={"vertical"}
          onFinish={(values) => {
            setLoading(true);
            createTeacher({
              variables: {
                input: values,
              },
            })
              .then(() => {
                refetch();
                setVisible(false);
                setLoading(false);
              })
              .catch((e) => {
                setLoading(false);
                notification.error({
                  message: "Có lỗi xảy " + e.toLocaleString(),
                });
              });
          }}
        >
          <Form.Item
            label={"Email"}
            name={"email"}
            rules={[{ required: true, message: "Email là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Mật khẩu"}
            name={"password"}
            rules={[{ required: true, message: "Mật khẩu là bắt buộc" }]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            label={"Họ"}
            name={"lastName"}
            rules={[{ required: true, message: "Họ là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Tên"}
            name={"firstName"}
            rules={[{ required: true, message: "Tên là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Số điện thoại"}
            name={"phone"}
            rules={[{ required: true, message: "Số điện thoại là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Nơi công tác"}
            name={"workPlace"}
            rules={[{ required: true, message: "Nơi công tác là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <div className={"submit"}>
            <Button loading={isLoading} htmlType={"submit"}>
              Thêm giảng viên
            </Button>
          </div>
        </Form>
      </Drawer>

      <Drawer
        onClose={() => setUpdate(null)}
        title={"Sửa thông tin giảng viên"}
        placement="right"
        width={520}
        visible={!!update}
      >
        <Form
          initialValues={
            update
              ? {
                  firstName: update.firstName,
                  lastName: update.lastName,
                  email: update.user.email,
                  phone: update.phone,
                  workPlace: update.workPlace,
                }
              : {}
          }
          layout={"vertical"}
          onFinish={(values) => {
            setLoading(true);
            updateTeacher({
              variables: {
                id: update ? update.id : null,
                input: values,
              },
            })
              .then(() => {
                refetch();
                setUpdate(null);
                setLoading(false);
              })
              .catch((e) => {
                setLoading(false);
                notification.error({
                  message: "Có lỗi xảy " + e.toLocaleString(),
                });
              });
          }}
        >
          <Form.Item
            label={"Email"}
            name={"email"}
            rules={[{ required: true, message: "Email là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Họ"}
            name={"lastName"}
            rules={[{ required: true, message: "Họ là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Tên"}
            name={"firstName"}
            rules={[{ required: true, message: "Tên là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Số điện thoại"}
            name={"phone"}
            rules={[{ required: true, message: "Số điện thoại là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Nơi công tác"}
            name={"workPlace"}
            rules={[{ required: true, message: "Nơi công tác là bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <div className={"submit"}>
            <Button loading={isLoading} htmlType={"submit"}>
              Sửa thông tin giảng viên
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default ListTeachers;
