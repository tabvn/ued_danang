import React from 'react';
import {PageHeader} from "antd";
import ListCourses from "../../components/ListCourses";

const AdminCourses = () => {
    return <div>
        <PageHeader className="site-page-header" title="Danh sách học phần đang mở"/>
        <ListCourses />
    </div>
};

export default AdminCourses;