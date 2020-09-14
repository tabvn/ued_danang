import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_STUDENTS } from "../../graphqls/query/students";
import { Button, Drawer, Form, Input, notification, Select, Table } from "antd";
import ClassSelection from "../classes/ClassSelection";
import StudentFilter from "./StudentFilter";

const createStudentMutation = gql`
  mutation createStudent($input: StudentInput!) {
    createStudent(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

const updateStudentMutation = gql`
  mutation updateStudent($id: ID!, $input: UpdateStudentInput!) {
    updateStudent(id: $id, input: $input) {
      id
      firstName
      lastName
    }
  }
`;
const ListStudents = () => {
  const [isLoading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [createStudent] = useMutation(createStudentMutation);
  const [updateStudent] = useMutation(updateStudentMutation);
  const [editStudent, setEditStudent] = useState(null);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [filter, setFilter] = useState({
    limit: 50,
    offset: 0,
  });
  const { loading, error, data, refetch } = useQuery(GET_STUDENTS, {
    variables: {
      filter: { ...filter },
    },
  });

  const columns = [
    {
      title: "Mã SV",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Lớp",
      dataIndex: ["student", "class", "name"],
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return <div>{`${record.lastName} ${record.firstName}`}</div>;
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (text, record) => {
        return <div>{record.gender === 0 ? "Nữ" : "Nam"}</div>;
      },
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "",
      render: (text, record) => (
        <div>
          <Button
            onClick={() => {
              setVisible(true);
              setEditStudent(record);
            }}
            size="small"
          >
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button
        onClick={() => {
          setEditStudent(false);
          setShowEditPassword(false);
          setVisible(true);
        }}
      >
        Thêm sinh viên
      </Button>
      <div className={"filter"}>
        <StudentFilter
          onChange={(v) => {
            setFilter({ ...filter, classId: v.classId });
          }}
        />
      </div>
      <Table
        scroll={{ x: 1200 }}
        loading={loading}
        pagination={{
          current: page,
          total: data ? data.students.total : 0,
          pageSize: filter.limit,
          showTotal: (total, range) => `${range}of ${total}`,
          onChange: (page, pageSize) => {
            setPage(page);
            setFilter({ ...filter, offset: (page - 1) * pageSize });
          },
        }}
        dataSource={data ? data.students.nodes : []}
        columns={columns}
      />

      {visible && (
        <Drawer
          onClose={() => {
            setEditStudent(null);
            setVisible(false);
            setShowEditPassword(false);
          }}
          title={editStudent ? "Sửa thông tin sinh viên" : "Thêm sinh viên"}
          placement="right"
          width={window.innerWidth < 520 ? window.innerWidth : 520}
          visible={visible}
        >
          <Form
            initialValues={
              editStudent
                ? {
                    email: editStudent.user.email,
                    code: editStudent.code,
                    lastName: editStudent.lastName,
                    firstName: editStudent.firstName,
                    birthday: editStudent.birthday,
                    gender: editStudent.gender,
                    classId: editStudent.classId,
                  }
                : null
            }
            layout={"vertical"}
            onFinish={(values) => {
              setLoading(true);
              if (editStudent) {
                updateStudent({
                  variables: {
                    id: editStudent.id,
                    input: values,
                  },
                })
                  .then(() => {
                    refetch();
                    setShowEditPassword(false);
                    setVisible(false);
                    setLoading(false);
                  })
                  .catch((e) => {
                    setLoading(false);
                    notification.error({
                      message: "Có lỗi xảy " + e.toLocaleString(),
                    });
                  });
              } else {
                createStudent({
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
              }
            }}
          >
            <Form.Item
              label={"Email"}
              name={"email"}
              rules={[{ required: true, message: "Email là bắt buộc" }]}
            >
              <Input />
            </Form.Item>
            {editStudent && (
              <>
                {showEditPassword ? (
                  <>
                    <Form.Item
                      label={"Mật khẩu mới"}
                      name="password"
                      rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </>
                ) : (
                  <div className="ant-form-item">
                    <Button
                      onClick={() => {
                        setShowEditPassword(true);
                      }}
                      type="default"
                    >
                      Đổi mât khẩu
                    </Button>
                  </div>
                )}
              </>
            )}
            {!editStudent && (
              <Form.Item
                label={"Mật khẩu"}
                name={"password"}
                rules={[{ required: true, message: "Mật khẩu là bắt buộc" }]}
              >
                <Input type="password" />
              </Form.Item>
            )}
            <Form.Item
              label={"Mã sinh viên"}
              name={"code"}
              rules={[{ required: true, message: "Mã sinh viên là bắt buộc" }]}
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
              label={"Ngày sinh"}
              name={"birthday"}
              rules={[{ required: true, message: "Ngày sinh là bắt buộc" }]}
            >
              <Input placeholder={"dd/mm/yyyy"} />
            </Form.Item>
            <Form.Item
              label={"Giới tính"}
              name={"gender"}
              rules={[{ required: true, message: "Giới tính là bắt buộc" }]}
            >
              <Select>
                <Select.Option value={0}>Nữ</Select.Option>
                <Select.Option value={1}>Nam</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={"Lớp"}
              name={"classId"}
              rules={[{ required: true, message: "Lớp là bắt buộc" }]}
            >
              <ClassSelection />
            </Form.Item>
            <div className={"submit"}>
              <Button loading={isLoading} htmlType={"submit"}>
                {editStudent ? "Lưuu thông tin" : "Thêm sinh viên"}
              </Button>
            </div>
          </Form>
        </Drawer>
      )}
    </div>
  );
};

export default ListStudents;