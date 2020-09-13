import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Drawer, Form, Input, notification, Table } from "antd";
import { GET_FACULTIES } from "../../graphqls/query/faculties";
import { gql } from "apollo-boost";

const createFacultyMutation = gql`
  mutation createFaculty($input: FacultyInput!) {
    createFaculty(input: $input) {
      id
      name
    }
  }
`;

const updateFacultyMutation = gql`
  mutation updateFaculty($id: ID!, $input: FacultyInput!) {
    updateFaculty(id: $id, input: $input) {
      id
      name
    }
  }
`;
const ListFaculties = () => {
  const [visible, setVisible] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_FACULTIES);
  const [createFaculty] = useMutation(createFacultyMutation);
  const [updateFaculty] = useMutation(updateFacultyMutation);
  const [update, setUpdate] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "",
      render: (text, record) => (
        <Button onClick={() => setUpdate(record)} size="small">
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={() => setVisible(true)}>Thêm khoa</Button>
      <Table
        pagination={false}
        loading={loading}
        dataSource={data ? data.faculties : []}
        columns={columns}
      />
      {visible && (
        <Drawer
          onClose={() => setVisible(false)}
          title={"Thêm khoa"}
          placement="right"
          width={520}
          visible={visible}
        >
          <Form
            onFinish={(values) => {
              setLoading(true);
              createFaculty({
                variables: {
                  input: values,
                },
              })
                .then(() => {
                  setLoading(false);
                  refetch();
                  setVisible(false);
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
              label={"Tên khoa"}
              name={"name"}
              rules={[{ required: true, message: "Tên khoa là bắt buộc" }]}
            >
              <Input />
            </Form.Item>
            <div className={"submit"}>
              <Button loading={isLoading} htmlType={"submit"}>
                Thêm khoa
              </Button>
            </div>
          </Form>
        </Drawer>
      )}
      {update ? (
        <Drawer
          width={520}
          visible={!!update}
          onClose={() => setUpdate(null)}
          title={"Sửa thông tin khoa"}
        >
          <Form
            initialValues={{
              name: update ? update.name : null,
            }}
            onFinish={(values) => {
              setLoading(true);
              updateFaculty({
                variables: {
                  id: update.id,
                  input: values,
                },
              })
                .then(() => {
                  setLoading(false);
                  setUpdate(null);
                })
                .catch((e) => {
                  setLoading(false);
                  notification.error({ message: "Có lỗi xảy ra" });
                });
            }}
          >
            <Form.Item name={"name"} label={"Tên khoa"}>
              <Input />
            </Form.Item>
            <div>
              <Button loading={isLoading} htmlType="submit">
                Lưu thông tin
              </Button>
            </div>
          </Form>
        </Drawer>
      ) : null}
    </div>
  );
};

export default ListFaculties;
