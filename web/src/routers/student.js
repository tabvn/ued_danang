import {ReadOutlined} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import React from "react";
import StudentOpenCourses from "../pages/student/StudentOpenCourses";

export default [
    {
        exact: true,
        title: "Đăng ký học phần",
        component: StudentOpenCourses,
        path: "/student/open-courses",
        icon: <ReadOutlined />,
        layout: MainLayout,
        role: 'Student'
    },
]