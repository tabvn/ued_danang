import {UsergroupAddOutlined,BarChartOutlined} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import React from "react";
import TeacherStudents from "../pages/teacher/TeacherStudents";
import TeacherClassStudents from "../pages/teacher/TeacherClassStudents";
import TeacherScoreManagement from "../pages/teacher/TeacherScoreManagement";

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
    {
        exact: true,
        title: "Danh sách tôi chủ nhiệm",
        component: TeacherClassStudents,
        path: "/teacher/class/students",
        icon: <UsergroupAddOutlined/>,
        layout: MainLayout,
        role: 'Teacher'
    },
    {
        exact: true,
        title: "Quản lý điểm thi",
        component: TeacherScoreManagement,
        path: "/teacher/scores",
        icon: <BarChartOutlined />,
        layout: MainLayout,
        role: 'Teacher'
    },
]