import React from 'react';
import {useLazyQuery} from "@apollo/react-hooks";
import TeacherCourseSelection from "./TeacherCourseSelection";
import styled from "styled-components";
import {TEACHER_COURSE_STUDENTS} from "../../graphqls/query/techerStudents";
import {Table} from "antd";

const Container = styled.div`
.ant-select{
    min-width: 300px;
 }
`
const TeacherListStudent = () => {
    const [getDog, {loading, data}] = useLazyQuery(TEACHER_COURSE_STUDENTS);

    const columns = [
        {
            title: 'Mã SV',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <div>{`${record.lastName} ${record.firstName}`}</div>
            }
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (text, record) => {
                return <div>{record.gender === 0 ? 'Nữ' : 'Nam'}</div>
            }
        },
        {
            title: 'Email',
            dataIndex: ["user", "email"],
            key: 'email',
        },
        {
            title: 'Ngày sinh',
            dataIndex: "birthday",
            key: 'birthday',
        },
        {
            title: 'Lớp',
            dataIndex: 'class',
            key: 'class',
            render: (text, record) => {
                return <div>{record.class.name}</div>
            }
        }
    ];
    return (
        <Container>
            <span>Chọn lớp học phần: </span><TeacherCourseSelection onChange={(courseId) => {
                getDog({
                    variables: {
                        courseId,
                    }
                })
            }}/>
            <Table loading={loading} columns={columns} dataSource={data ? data.teacherCourseStudents : []}/>
        </Container>
    );
};

export default TeacherListStudent;
