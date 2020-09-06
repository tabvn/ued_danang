import React, {forwardRef} from 'react';
import {useQuery} from "@apollo/react-hooks";
import {Skeleton,Select} from 'antd'
import {GET_ALL_TEACHERS} from "../../graphqls/query/teachers";

const TeacherSelection = forwardRef(((props, ref) => {
	const {loading, error, data, refetch} = useQuery(GET_ALL_TEACHERS);
	if (loading) return <Skeleton />
	const nodes = data ? data.teachers.nodes : []
	return <Select onChange={(v) => {
		props.onChange(v)
	}}>
		{nodes.map((node, index) => {
			return <Select.Option key={`k-${index}`} value={node.userId}>{`${node.lastName} ${node.firstName}`}</Select.Option>
		})}
	</Select>
}))

export default TeacherSelection