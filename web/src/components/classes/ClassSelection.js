import React, {forwardRef, useState} from 'react';
import {useQuery} from "@apollo/react-hooks";
import {Select, Skeleton} from 'antd'
import {GET_CLASSES} from "../../graphqls/query/classes";

const ClassSelection = forwardRef(((props, ref) => {
    const {loading, error, data, refetch} = useQuery(GET_CLASSES, {
        variables: {
            filter: {
                limit: 100,
                offset: 0,
                teacherId: props.teacherId ? props.teacherId : null,
            }
        }
    });

    const [value, setValue] = useState(props.value)
    if (loading) return <Skeleton/>
    const nodes = data ? data.classes.nodes : []
    return <Select value={value} onChange={(v) => {
        setValue(v)
        props.onChange(v)
    }}>
        {nodes.map((node, index) => {
            return <Select.Option key={`k-${index}`} value={node.id}>{`${node.name}`}</Select.Option>
        })}
    </Select>
}))

export default ClassSelection