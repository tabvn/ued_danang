import AdminStudent from "../pages/admin/AdminStudents";
import {
    BarChartOutlined,
    ContactsOutlined,
    ProfileOutlined,
    ReadOutlined,
    RobotOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import React from "react";
import AdminClasses from "../pages/admin/AdminClasses";
import AdminFaculties from "../pages/admin/AdminFacultties";
import AdminTeachers from "../pages/admin/AdminTeachers";
import AdminCourses from "../pages/admin/AdminCourses";
import AdminCourseStudent from "../pages/admin/AdminCourseStudents";
import AdminScoreManagement from "../pages/admin/AdminScoreManagement";
import AdminUsers from "../pages/admin/AdminUsers";

export default [
    {
        exact: true,
        title: "Danh sách khoa",
        component: AdminFaculties,
        path: "/admin/faculties",
        icon: <ContactsOutlined/>,
        layout: MainLayout,
        role: "Administrator",
    },
    {
        exact: true,
        title: "Danh sách giảng viên",
        component: AdminTeachers,
        path: "/admin/teachers",
        icon: <UsergroupAddOutlined/>,
        layout: MainLayout,
        role: "Administrator",
    },
    {
        exact: true,
        title: "Danh sách lớp",
        component: AdminClasses,
        path: "/admin/classes",
        icon: <ProfileOutlined/>,
        layout: MainLayout,
        role: "Administrator",
    },
    {
        exact: true,
        title: "Danh sách sinh viên",
        component: AdminStudent,
        path: "/admin/students",
        icon: <RobotOutlined/>,
        layout: MainLayout,
        role: "Administrator",
    },
    {
        exact: true,
        title: "Quản lý học phần",
        component: AdminCourses,
        path: "/admin/courses",
        icon: <ReadOutlined/>,
        layout: MainLayout,
        role: "Administrator",
        child: [
            {
                exact: true,
                title: "Học phần đang mở",
                component: AdminCourses,
                path: "/admin/courses",
                icon: <UserOutlined/>,
                layout: MainLayout,
                role: "Administrator",
            },
            {
                exact: true,
                title: "Danh sách đăng ký",
                component: AdminCourseStudent,
                path: "/admin/courses/students",
                icon: <UserOutlined/>,
                layout: MainLayout,
                role: "Administrator",
            },
        ],
    },
    {
        exact: true,
        title: "Quản lý điểm",
        component: AdminScoreManagement,
        path: "/admin/scores",
        icon: <BarChartOutlined/>,
        layout: MainLayout,
        role: "Administrator",
    },
    {
        exact: true,
        title: "Quản trị viên",
        component: AdminUsers,
        path: "/admin/users",
        icon: <SettingOutlined/>,
        layout: MainLayout,
        role: "Administrator",
    },
];