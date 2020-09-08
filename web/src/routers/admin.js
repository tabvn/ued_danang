import AdminStudent from "../pages/admin/AdminStudents";
import {UserOutlined} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import React from "react";
import AdminClasses from "../pages/admin/AdminClasses";
import AdminFaculties from "../pages/admin/AdminFacultties";
import AdminTeachers from "../pages/admin/AdminTeachers";
import AdminCourses from "../pages/admin/AdminCourses";
import AdminCourseStudent from "../pages/admin/AdminCourseStudents";

export default [
    {
        exact: true,
        title: "Danh sách khoa",
        component: AdminFaculties,
        path: "/admin/faculties",
        icon: <UserOutlined/>,
        layout: MainLayout,
        role: 'Administrator'
    },
    {
        exact: true,
        title: "Danh sách giảng viên",
        component: AdminTeachers,
        path: "/admin/teachers",
        icon: <UserOutlined/>,
        layout: MainLayout,
        role: 'Administrator'
    },
    {
        exact: true,
        title: "Danh sách lớp",
        component: AdminClasses,
        path: "/admin/classes",
        icon: <UserOutlined/>,
        layout: MainLayout,
        role: 'Administrator'
    },
    {
        exact: true,
        title: "Danh sách sinh viên",
        component: AdminStudent,
        path: "/admin/students",
        icon: <UserOutlined/>,
        layout: MainLayout,
        role: 'Administrator'
    },
    {
        exact: true,
        title: "Quản lý học phần",
        component: AdminCourses,
        path: "/admin/courses",
        icon: <UserOutlined/>,
        layout: MainLayout,
        role: 'Administrator',
        child: [
            {
                exact: true,
                title: "Học phần đang mở",
                component: AdminCourses,
                path: "/admin/courses",
                icon: <UserOutlined/>,
                layout: MainLayout,
                role: 'Administrator',
            },
            {
                exact: true,
                title: "Danh sách đăng ký",
                component: AdminCourseStudent,
                path: "/admin/courses/students",
                icon: <UserOutlined/>,
                layout: MainLayout,
                role: 'Administrator',
            }
        ]
    },

]