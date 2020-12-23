import React, { forwardRef, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Select, Skeleton } from "antd";
import { GET_ALL_TEACHERS } from "../../graphqls/query/teachers";

const TeacherSelection = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value);
  useEffect(() => {}, [props.value]);
  const { loading, error, data, refetch } = useQuery(GET_ALL_TEACHERS, {
    fetchPolicy: "network-only"
  });
  if (loading) return <Skeleton />;
  const nodes = data ? data.teachers.nodes : [];
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
          >{`${node.lastName} ${node.firstName}`}</Select.Option>
        );
      })}
    </Select>
  );
});

export default TeacherSelection