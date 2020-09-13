import React from 'react';
import {useLazyQuery} from "@apollo/client";
import styled from "styled-components";
import {TEACHER_CLASS_STUDENTS} from "../../graphqls/query/techerStudents";
import {Table} from "antd";
import TeacherClassSelection from "../classes/TeacherClassSelection";

const Container = styled.div`
.ant-select{
    min-width: 300px;
 }
`
const ListTeacherClassStudents = () => {
    const [getStudents, {loading, data}] = useLazyQuery(TEACHER_CLASS_STUDENTS);

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
            <span>Chọn lớp sinh hoạt: </span><TeacherClassSelection onChange={(classId) => {
            getStudents({
                variables: {
                    classId,
                }
            })
        }}/>
            <Table loading={loading} columns={columns} dataSource={data ? data.teacherClassStudents : []}/>
        </Container>
    );
};

export default ListTeacherClassStudents;
