import React, {forwardRef, useEffect, useState} from "react";
import {useLazyQuery} from "@apollo/client";
import {Select, Skeleton} from "antd";
import {GET_ALL_COURSES} from "../../graphqls/query/courses";

const CourseSelection = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value ? props.value : null);
    const [getData, {loading, data}] = useLazyQuery(GET_ALL_COURSES);
    useEffect(() => {
        getData({
            variables: {
                filter: {
                    limit: -1,
                    offset: 0,
                    year: props.year,
                    semester: props.semester,
                },
            },
        });
    }, [props.year, props.semester]);
    const nodes = data ? data.courses.nodes : [];
    return (
        <Select
            loading={loading}
            value={value}
            mode={props.mode}
            style={props.style}
            onChange={(v) => {
                setValue(v);
                props.onChange(
                    v,
                    data.courses.nodes.find((s) => s.id === v)
                );
            }}
        >
            {nodes.map((f, index) => (
                <Select.Option key={index} value={f.id}>
                    {`${f.code} - ${f.title}`}
                </Select.Option>
            ))}
        </Select>
    );
});

export default CourseSelection;
