import React, {useState} from 'react';
import {useQuery} from "@apollo/react-hooks";
import {GET_STUDENTS} from "../../graphqls/query/students";
import {Table} from "antd";

const ListStudents = () => {
	const {page, setPage} = useState(1)
	const {filter, setFilter} = useState({
		limit: 50,
		offset: 0,
	})
	const { loading, error, data, refetch } = useQuery(GET_STUDENTS, {
		variables: {
			filter: { ...filter },
		},
	});

	const columns = [
		{
			title: 'MSV',
			dataIndex: 'code',
			key: 'code',
		},
		{
			title: 'Họ và tên',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => {
				return <div>{`${record.lastName} ${record.firstName}`}</div>
			}
		},
		{
			title: 'Lớp',
			dataIndex: 'class',
			key: 'class',
			render: (text, record) => {
				return <div>{record.class.name}</div>
			}
		},
	];

	return (
		<div>
			<Table
				pagination={{
					current: page,
					total: data ? data.students.total : 0,
					pageSize: filter.limit,
					showTotal: (total, range) => `${range}of ${total}`,
					onChange: (page, pageSize) => {
						setPage(page);
						setFilter({...filter, offset: (page - 1) * pageSize});
					},
				}}
				dataSource={data ? data.students.nodes : []} columns={columns} />
		</div>
	);
};

export default ListStudents;
