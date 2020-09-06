import React, {forwardRef} from 'react';
import {useQuery} from "@apollo/react-hooks";
import {GET_FACULTIES} from "../../graphqls/query/faculties";
import {Skeleton,Select} from 'antd'

const FacultySelection = forwardRef(((props, ref) => {
	const {loading, error, data, refetch} = useQuery(GET_FACULTIES);
	if (loading) return <Skeleton />
	const faculties = data ? data.faculties : []
	return <Select>
		{faculties.map((f, index) => (
			<Select.Option key={index} value={f.id}>{f.name}</Select.Option>
		))}
	</Select>
}))

export default FacultySelection