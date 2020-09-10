import React from 'react';
import {PageHeader} from "antd";
import ListTeacherClassStudents from "../../components/teacher/ListTeacherClassStudents";

const TeacherClassStudents = () => {
    return (
        <div>
            <PageHeader className="site-page-header" title="Danh sách sinh viên"/>
            <ListTeacherClassStudents/>
        </div>
    );
};

export default TeacherClassStudents;
