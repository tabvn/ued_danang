import React, {forwardRef} from 'react';
import {useQuery} from "@apollo/react-hooks";
import {Skeleton,Select} from 'antd'
import {GET_ALL_TEACHERS} from "../../graphqls/query/teachers";

const TeacherSelection = forwardRef(((props, ref) => {
	const {loading, error, data, refetch} = useQuery(GET_ALL_TEACHERS);
	if (loading) return <Skeleton />
	const nodes = data ? data.teachers.nodes : []
	return <Select>
		{nodes.map((node, index) => (
			<Select.Option key={index} value={node.user_id}>{`${node.lastName} ${node.firstName}`}</Select.Option>
		))}
	</Select>
}))

export default TeacherSelection