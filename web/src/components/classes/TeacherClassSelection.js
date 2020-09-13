import React, { forwardRef, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Select, Skeleton } from "antd";
import { TEACHER_CLASSES } from "../../graphqls/query/classes";

const TeacherClassSelection = forwardRef((props, ref) => {
  const { loading, error, data, refetch } = useQuery(TEACHER_CLASSES);
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    if (data && data.teacherClasses.length === 1) {
      props.onChange(data.teacherClasses[0].id);
      setValue(data.teacherClasses[0].id);
    }
  }, [data]);
  if (loading) return <Skeleton />;
  const nodes = data ? data.teacherClasses : [];
  return (
    <Select
      value={value}
      onChange={(v) => {
        setValue(v);
        props.onChange(v);
      }}
    >
      {nodes.map((node, index) => {
        return (
          <Select.Option
            key={`k-${index}`}
            value={node.id}
          >{`${node.name}`}</Select.Option>
        );
      })}
    </Select>
  );
});

export default TeacherClassSelection;
