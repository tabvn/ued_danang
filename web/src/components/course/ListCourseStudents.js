import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import {useQuery} from "@apollo/react-hooks";
import {GET_ALL_COURSE_STUDENTS} from "../../graphqls/query/courseStudents";
import moment from 'moment'

const ListCourseStudents = (props) => {
    const {loading, error, data, refetch} = useQuery(GET_ALL_COURSE_STUDENTS, {
        fetchPolicy: "cache-and-network",
        variables: {
            courseId: props.courseId,
            filter: {
                limit: 200,
                offset: 0,
            },
        },
    });

    const columns = [
        {
            title: "Mã sinh viên",
            render: (text, record) => <div>
                {record.student.code}
            </div>
        },
        {
            title: "Họ và tên",
            render: (text, record) => <div>
                {`${record.student.lastName} ${record.student.firstName}`}
            </div>
        },
        {
            title: "Ngày sinh",
            render: (text, record) => <div>
                {`${record.student.birthday}`}
            </div>
        },
        {
            title: "Lớp sinh hoạt",
            render: (text, record) => <div>
                {`${record.student.class.name}`}
            </div>
        },
        {
            title: "Thời gian đăng ký",
            render: (text, record) => <div>
                {moment(record.createdAt).format("DD/MM/YYYY hh:mm:ss")}
            </div>
        }
    ]
    return (
        <div>
            <Table
                loading={loading}
                pagination={false}
                dataSource={data ? data.courseStudents : []} columns={columns}/>
        </div>
    );
};

export default ListCourseStudents;
