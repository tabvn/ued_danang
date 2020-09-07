import React from 'react';
import {PageHeader,Table} from "antd";

const AdminCourses = () => {

	const columns = [
		{
			title: "Tên học phần",
			dataIndex: "name"
		},
		{
			title: "Mã học phần",
			dataIndex: "code"
		},
		{
			title: "Số lượng tối đa",
			dataIndex: "limit"
		}
	]

	const dataSource = [
		{
			name: "ACB",
			code: "001",
			limit: 100,
		}
	]
	return <div>
		<PageHeader className="site-page-header" title="Danh sách học phần đang mở" />
		<Table columns={columns} dataSource={dataSource} />
	</div>
};

export default AdminCourses;