import {UsergroupAddOutlined} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import React from "react";
import TeacherStudents from "../pages/teacher/TeacherStudents";

export default [
    {
        exact: true,
        title: "Danh sách tôi giảng dạy",
        component: TeacherStudents,
        path: "/teacher/course/students",
        icon: <UsergroupAddOutlined/>,
        layout: MainLayout,
        role: 'Teacher'
    },
]