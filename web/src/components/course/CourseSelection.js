import React, { forwardRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { Select, Skeleton } from "antd";
import { GET_ALL_COURSES } from "../../graphqls/query/courses";

const CourseSelection = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value ? props.value : null);
  const { loading, error, data, refetch } = useQuery(GET_ALL_COURSES);
  if (loading) return <Skeleton />;
  const nodes = data ? data.courses.nodes : [];
  return (
    <Select
      value={value}
      mode={props.mode}
      onChange={(v) => {
        setValue(v);
        props.onChange(v, data.courses.nodes.find((s) => s.id === v));
      }}
    >
      {nodes.map((f, index) => (
        <Select.Option key={index} value={f.id}>
          {f.title}
        </Select.Option>
      ))}
    </Select>
  );
});

export default CourseSelection;