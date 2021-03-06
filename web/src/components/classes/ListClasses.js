import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CLASSES } from "../../graphqls/query/classes";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  notification,
  Table,
} from "antd";
import { gql } from "apollo-boost";
import FacultySelection from "../facultty/FacultySelection";
import TeacherSelection from "../teacher/TeacherSelection";

const createClassMutation = gql`
  mutation createClass($input: ClassInput!) {
    createClass(input: $input) {
      id
      name
    }
  }
`;

const updateClassMutation = gql`
  mutation updateClass($id: ID!, $input: UpdateClassInput!) {
    updateClass(id: $id, input: $input) {
      id
      name
    }
  }
`;

const ListClasses = () => {
  const [isLoading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    limit: 50,
    offset: 0,
  });
  const { loading, error, data, refetch } = useQuery(GET_CLASSES, {
    variables: {
      filter: { ...filter },
    },
  });
  const [createClass] = useMutation(createClassMutation);
  const [updateClass] = useMutation(updateClassMutation);
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Khoa",
      dataIndex: "faculty",
      render: (text, record) => <div>{record.faculty.name}</div>,
    },
    {
      title: "Khoá",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "GV chủ nhiệm",
      dataIndex: "teacher",
      key: "teacher",
      render: (text, record) => {
        return (
          <div>{`${record.teacher.lastName} ${record.teacher.firstName}`}</div>
        );
      },
    },
    {
      title: "",
      render: (text, record) => (
        <div>
          <Button
            onClick={() => {
              setVisible(true);
              setEditClass(record);
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
      <Button onClick={() => setVisible(true)}>Thêm lớp</Button>
      <Table
        scroll={{ x: 1200 }}
        pagination={{
          current: page,
          total: data ? data.classes.total : 0,
          pageSize: filter.limit,
          showTotal: (total, range) => `${range}of ${total}`,
          onChange: (page, pageSize) => {
            setPage(page);
            setFilter({ ...filter, offset: (page - 1) * pageSize });
          },
        }}
        loading={loading}
        dataSource={data ? data.classes.nodes : []}
        columns={columns}
      />
      {visible && (
        <Drawer
          onClose={() => setVisible(false)}
          title={editClass ? "Sửa thông tin lớp" : "Thêm lớp"}
          placement="right"
          width={window.innerWidth < 620 ? window.innerWidth : 620}
          visible={visible}
        >
          <Form
            initialValues={
              editClass
                ? {
                    name: editClass.name,
                    facultyId: editClass.facultyId,
                    teacherId: editClass.teacherId,
                    year: editClass.year,
                  }
                : null
            }
            layout="vertical"
            onFinish={(values) => {
              setLoading(true);
              if (editClass) {
                updateClass({
                  variables: {
                    id: editClass.id,
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
              } else {
                createClass({
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
              label={"Tên lớp"}
              name={"name"}
              rules={[{ required: true, message: "Tên lớp là bắt buộc" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={"facultyId"}
              label={"Khoa"}
              rules={[{ required: true, message: "Vui lòng chọn khoa" }]}
            >
              <FacultySelection />
            </Form.Item>
            <Form.Item
              name={"teacherId"}
              label={"Giáo viên chủ nhiệm"}
              rules={[
                {
                  required: true,
                  message: "Vui long chọn giáo viên chủ nhiệm",
                },
              ]}
            >
              <TeacherSelection />
            </Form.Item>
            <Form.Item
              name={"year"}
              label={"Khoá"}
              rules={[{ required: true, message: "Nhập niên khoá" }]}
            >
              <InputNumber />
            </Form.Item>
            <div className={"submit"}>
              <Button loading={isLoading} htmlType={"submit"}>
                {editClass ? "Lưu thông tin" : "Thêm lớp"}
              </Button>
            </div>
          </Form>
        </Drawer>
      )}
    </div>
  );
};

export default ListClasses;
