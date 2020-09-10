import React from 'react';
import TeacherListStudent from "../../components/teacher/TeacherListStudents";
import {PageHeader} from "antd";

const TeacherStudents = () => {
    return (
        <div>
            <PageHeader className="site-page-header" title="Danh sách sinh viên" />
            <TeacherListStudent/>
        </div>
    );
};

export default TeacherStudents;
