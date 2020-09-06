import React, {forwardRef} from 'react';
import {useQuery} from "@apollo/react-hooks";
import {Skeleton,Select} from 'antd'
import {GET_CLASSES} from "../../graphqls/query/classes";

const ClassSelection = forwardRef(((props, ref) => {
	const {loading, error, data, refetch} = useQuery(GET_CLASSES, {variables: {
			filter: {
				limit: 100,
				offset: 0,
			}
		}});
	if (loading) return <Skeleton />
	const nodes = data ? data.classes.nodes : []
	return <Select onChange={(v) => {
		props.onChange(v)
	}}>
		{nodes.map((node, index) => {
			return <Select.Option key={`k-${index}`} value={node.id}>{`${node.name}`}</Select.Option>
		})}
	</Select>
}))

export default ClassSelection