import React, { useState } from "react";
import { useMutation, useQuery,gql } from "@apollo/client";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Table,
  Tag,
} from "antd";
import { GET_ALL_COURSES } from "../../graphqls/query/courses";
import FacultySelection from "../facultty/FacultySelection";
import TeacherSelection from "../teacher/TeacherSelection";

const createCourseMutation = gql`
  mutation createCourse($input: CourseInput!) {
    createCourse(input: $input) {
      id
      title
    }
  }
`;

const updateCourseMutation = gql`
  mutation updateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
      teacherId
    }
  }
`;
const ListCourses = () => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [createCourse] = useMutation(createCourseMutation);
  const [updateCourse] = useMutation(updateCourseMutation);
  const [filter, setFilter] = useState({
    limit: 50,
    offset: 0,
  });
  const { loading, error, data, refetch } = useQuery(GET_ALL_COURSES, {
    variables: {
      filter: { ...filter },
    },
  });
  const [editCourse, setEditCourse] = useState(null);
  const columns = [
    {
      title: "Mã học phần",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên học phần",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Số tín chỉ",
      dataIndex: "unit",
      key: "unt",
    },
    {
      title: "Giảng viên",
      dataIndex: "teacher",
      key: "teacher",
      render: (text, record) => (
        <div>{`${record.teacher.lastName} ${record.teacher.firstName}`}</div>
      ),
    },
    {
      title: "Thời khoá biểu",
      dataIndex: "lessionDay",
      key: "lessionDay",
      render: (text, record) => (
        <div>{`Thứ ${record.lessonDay}, tiết: ${record.lessonFrom} - ${record.lessonTo}`}</div>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "open",
      key: "open",
      render: (text, record) => (
        <Tag color={record.open ? "success" : "error"}>
          {record.open ? "Đang mở" : "Đã khoá"}
        </Tag>
      ),
    },
    {
      title: "Đăng ký",
      key: "total",
      render: (text, record) => (
        <div>{`${record.registerCount}/${record.limit}`}</div>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            onClick={() => {
              setEditCourse(record);
              setVisible(true);
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
          setEditCourse(null);
          setVisible(true);
        }}
      >
        Mở học phần mới
      </Button>
      <Table
        loading={loading}
        pagination={{
          current: page,
          total: data ? data.courses.total : 0,
          pageSize: filter.limit,
          showTotal: (total, range) => `${range}of ${total}`,
          onChange: (page, pageSize) => {
            setPage(page);
            setFilter({ ...filter, offset: (page - 1) * pageSize });
          },
        }}
        dataSource={data ? data.courses.nodes : []}
        columns={columns}
      />
      {visible && (
        <Drawer
          onClose={() => setVisible(false)}
          title={"Mở học phần mới"}
          placement="right"
          width={520}
          visible={visible}
        >
          <Form
            initialValues={
              editCourse
                ? {
                    code: editCourse.code,
                    title: editCourse.title,
                    required: editCourse.required,
                    unit: editCourse.unit,
                    lessonDay: editCourse.lessonDay,
                    lessonFrom: editCourse.lessonFrom,
                    lessonTo: editCourse.lessonTo,
                    limit: editCourse.limit,
                    teacherId: editCourse.teacherId,
                    open: editCourse.open,
                    faculties: editCourse.faculties
                      ? editCourse.faculties.map((f) => f.id)
                      : [],
                  }
                : null
            }
            layout={"vertical"}
            onFinish={(values) => {
              setLoading(true);
              if (!editCourse) {
                createCourse({
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
              } else {
                updateCourse({
                  variables: {
                    id: editCourse.id,
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
              label={"Mã học phần"}
              name={"code"}
              rules={[{ required: true, message: "Mã học phần là bắt buộc" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={"Tên học phần"}
              name={"title"}
              rules={[{ required: true, message: "Nhập tên học phần" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={"Loại học phần"}
              name={"required"}
              rules={[{ required: true, message: "Chọn loại học phần" }]}
            >
              <Select>
                <Select.Option value={false}>Học phần Tự chọn</Select.Option>
                <Select.Option value={true}>Hoc phần bắt buộc</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={"Số tín chỉ"}
              name={"unit"}
              rules={[{ required: true, message: "Nhập số tín chỉ" }]}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              label={"Thứ"}
              name={"lessonDay"}
              rules={[{ required: true, message: "Chọn Thứ" }]}
            >
              <Select>
                <Select.Option value={2}>Thứ 2</Select.Option>
                <Select.Option value={3}>Thứ 3</Select.Option>
                <Select.Option value={4}>Thứ 4</Select.Option>
                <Select.Option value={5}>Thứ 5</Select.Option>
                <Select.Option value={6}>Thứ 6</Select.Option>
                <Select.Option value={7}>Thứ 7</Select.Option>
                <Select.Option value={8}>Chủ nhật</Select.Option>
              </Select>
            </Form.Item>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={"Tiết bắt đầu"}
                  name={"lessonFrom"}
                  rules={[{ required: true, message: "Chọn tiết bắt đầu" }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={"Tiết kết thúc"}
                  name={"lessonTo"}
                  rules={[{ required: true, message: "Chọn tiết kết thúc" }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={"Giới hạn đăng ký"}
                  name={"limit"}
                  rules={[{ required: true, message: "Nhập giới hạn dăng ký" }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={"Giảng viên"}
              name={"teacherId"}
              rules={[{ required: true, message: "Chọn giảng viên" }]}
            >
              <TeacherSelection />
            </Form.Item>
            <Form.Item
              label={"Khoa"}
              name={"faculties"}
              rules={[{ required: true, message: "Chọn khoa" }]}
            >
              <FacultySelection mode={"multiple"} />
            </Form.Item>
            <Form.Item
              label={"Tình trạng"}
              name={"open"}
              rules={[
                { required: true, message: "Chọn tình trạng mở hay đóng" },
              ]}
            >
              <Select>
                <Select.Option value={true}>Cho phép đăng ký</Select.Option>
                <Select.Option value={false}>Đóng</Select.Option>
              </Select>
            </Form.Item>
            <div className={"submit"}>
              <Button loading={isLoading} htmlType={"submit"}>
                {editCourse ? "Lưu thông tin" : "Mở học phần"}
              </Button>
            </div>
          </Form>
        </Drawer>
      )}
    </div>
  );
};

export default ListCourses;
