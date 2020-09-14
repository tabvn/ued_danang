import {BarChartOutlined, ReadOutlined} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import React from "react";
import StudentOpenCourses from "../pages/student/StudentOpenCourses";
import StudentScores from "../pages/student/StudentScores";

export default [
    {
        exact: true,
        title: "Đăng ký học phần",
        component: StudentOpenCourses,
        path: "/student/open-courses",
        icon: <ReadOutlined/>,
        layout: MainLayout,
        role: "Student",
    },
    {
        exact: true,
        title: "Kết quả học tập",
        component: StudentScores,
        path: "/students/scores",
        icon: <BarChartOutlined/>,
        layout: MainLayout,
        role: "Student",
    },
];