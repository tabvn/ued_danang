import React, {useState} from 'react';
import {useLazyQuery} from "@apollo/client";
import TeacherCourseSelection from "./TeacherCourseSelection";
import styled from "styled-components";
import {TEACHER_COURSE_STUDENTS} from "../../graphqls/query/techerStudents";
import {Table} from "antd";
import TeacherNoteInput from "../course/TeacherNoteInput";

const Container = styled.div`
.ant-select{
    min-width: 300px;
 }
`
const TeacherListStudent = () => {
    const [getStudents, {loading, data}] = useLazyQuery(TEACHER_COURSE_STUDENTS);
    const [courseId, setCourseId] = useState(null)
    const columns = [
        {
            title: 'Mã SV',
            dataIndex: ["student", "code"],
            key: 'code',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <div>{`${record.student.lastName} ${record.student.firstName}`}</div>
            }
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (text, record) => {
                return <div>{record.student.gender === 0 ? 'Nữ' : 'Nam'}</div>
            }
        },
        {
            title: 'Email',
            dataIndex: ["student", "user", "email"],
            key: 'email',
        },
        {
            title: 'Ngày sinh',
            dataIndex: ["student", "birthday"],
            key: 'birthday',
        },
        {
            title: 'Lớp',
            dataIndex: 'class',
            key: 'class',
            render: (text, record) => {
                return <div>{record.student.class.name}</div>
            }
        },
        {
            title: "Ghi chú",
            dataIndex: "teacherNote",
            render: ((text, record) => (
                <TeacherNoteInput courseId={courseId} studentId={record.student.id} value={record.teacherNote}/>
            ))
        }
    ];
    return (
        <Container>
            <span>Chọn lớp học phần: </span><TeacherCourseSelection onChange={(cid) => {
            setCourseId(cid)
            getStudents({
                variables: {
                    courseId: cid,
                }
            })
        }}/>
            <Table loading={loading} columns={columns} dataSource={data ? data.teacherCourseStudents : []}/>
        </Container>
    );
};

export default TeacherListStudent;
