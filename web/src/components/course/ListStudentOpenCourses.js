import React, {useState} from "react";
import {useQuery} from "@apollo/react-hooks";
import {Table, Tag} from "antd";
import {GET_STUDENT_OPEN_COURSES} from "../../graphqls/query/studentOpenCourses";
import StudentRegisterCourseButton from "./StudentRegisterCourseButton";

const ListStudentOpenCourses = () => {
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({
        limit: 100,
        offset: 0,
    });
    const {loading, error, data, refetch} = useQuery(GET_STUDENT_OPEN_COURSES, {
        variables: {
            filter: {...filter},
        },
    });
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
            title: "Giảng viên",
            dataIndex: "teacher",
            key: "teacher",
            render: (text, record) => (
                <div>{`${record.teacher.lastName} ${record.teacher.firstName}`}</div>
            ),
        },
        {
            title: "Thời khoá biểu",
            dataIndex: "lesionDay",
            key: "lessonDay",
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
            key: "register",
            width: 200,
            render: (text, record) => (
                <StudentRegisterCourseButton onDone={() => refetch()} course={record}/>
            ),
        },
    ];

    return (
        <div>
            <Table
                loading={loading}
                rowKey={(record) => record.id}
                pagination={{
                    current: page,
                    total: data ? data.courses.total : 0,
                    pageSize: filter.limit,
                    showTotal: (total, range) => `${range}of ${total}`,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setFilter({...filter, offset: (page - 1) * pageSize});
                    },
                }}
                dataSource={data ? data.courses.nodes : []}
                columns={columns}
            />
        </div>
    );
};

export default ListStudentOpenCourses;
