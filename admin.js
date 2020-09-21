import React from 'react';
import ListStudents from "../../components/student/ListStudents";
import {PageHeader} from "antd";

const AdminStudent = () => {
	return <div>
		<PageHeader className="site-page-header" title="Sinh viên" />
		<ListStudents/>
	</div>
};

export default AdminStudent;
