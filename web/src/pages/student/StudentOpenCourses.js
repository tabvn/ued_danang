import React from 'react';
import {PageHeader} from "antd";
import ListStudentOpenCourses from "../../components/course/ListStudentOpenCourses";

const StudentOpenCourses = () => {
    return (
        <div>
            <PageHeader className="site-page-header" title="Học phần đang mở" />
            <ListStudentOpenCourses />
        </div>
    );
};

export default StudentOpenCourses;
