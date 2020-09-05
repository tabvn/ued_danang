import React from 'react';
import {PageHeader} from "antd";
import ListFaculties from "../../components/facultty/ListFaculties";

const AdminFaculties = () => {
	return <div>
		<PageHeader className="site-page-header" title="Danh sách khoa" />
		<ListFaculties/>
	</div>
};

export default AdminFaculties;
