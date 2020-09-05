import React, {useState} from 'react';
import {useQuery} from "@apollo/react-hooks";
import {GET_CLASSES} from "../../graphqls/query/classes";
import {Table} from "antd";

const ListClasses = () => {
	const {page, setPage} = useState(1)
	const {filter, setFilter} = useState({
		limit: 50,
		offset: 0,
	})
	const {loading, error, data, refetch} = useQuery(GET_CLASSES, {
		variables: {
			filter: {...filter},
		},
	});

	const columns = [
		{
			title: 'Tên',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'GV chủ nhiệm',
			dataIndex: 'teacher',
			key: 'teacher',
			render: (text, record) => {
				return <div>{`${record.teacher.lastName} ${record.teacher.firstName}`}</div>
			}
		},
	];

	return (
		<div>
			<Table
				pagination={{
					current: page,
					total: data ? data.classes.total : 0,
					pageSize: filter.limit,
					showTotal: (total, range) => `${range}of ${total}`,
					onChange: (page, pageSize) => {
						setPage(page);
						setFilter({...filter, offset: (page - 1) * pageSize});
					},
				}}
				loading={loading}
				dataSource={data ? data.classes.nodes : []} columns={columns}/>
		</div>
	);
};

export default ListClasses;
