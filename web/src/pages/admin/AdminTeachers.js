import React from 'react';
import {PageHeader} from "antd";
import ListTeachers from "../../components/teacher/ListTeachers";

const AdminTeachers = () => {
	return (
		<div>
			<PageHeader className="site-page-header" title="Giảng viên" />
			<ListTeachers />
		</div>
	);
};

export default AdminTeachers;
