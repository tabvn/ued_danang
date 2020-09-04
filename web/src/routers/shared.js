import React from "react";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import { BarChartOutlined } from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import LoginLayout from "../layout/LoginLayout";

export default [
  {
    exact: true,
    title: "Dashboard",
    component: Dashboard,
    path: "/",
    icon: <BarChartOutlined />,
    layout: MainLayout,
  },
  {
    path: "/login",
    component: Login,
    exact: true,
    layout: LoginLayout,
  },
];
