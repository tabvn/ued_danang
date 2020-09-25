import React, { forwardRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { Select } from "antd";
import { TEACHER_COURSES } from "../../graphqls/query/teacherCourses";

const TeacherCourseSelection = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value ? props.value : null);
  const { loading, error, data, refetch } = useQuery(TEACHER_COURSES);
  const nodes = data ? data.teacherCourses : [];
  return (
    <Select
      loading={loading}
      value={value}
      mode={props.mode}
      onChange={(v) => {
        setValue(v);
        props.onChange(
          v,
          nodes.find((n) => n.id === v)
        );
      }}
    >
      {nodes.map((f, index) => (
        <Select.Option
          key={index}
          value={f.id}
        >{`${f.code} - ${f.title}`}</Select.Option>
      ))}
    </Select>
  );
});

export default TeacherCourseSelection;
