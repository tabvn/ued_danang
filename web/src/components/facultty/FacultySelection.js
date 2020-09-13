import React, { forwardRef, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_FACULTIES } from "../../graphqls/query/faculties";
import { Select, Skeleton } from "antd";

const FacultySelection = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value);
  const { loading, error, data, refetch } = useQuery(GET_FACULTIES, {
    variables: {
      filter: { limit: 1000, offset: 0 },
    },
  });
  if (loading) return <Skeleton />;
  const faculties = data ? data.faculties : [];
  return (
    <Select
      value={value}
      mode={props.mode}
      onChange={(v) => {
        setValue(v);
        props.onChange(v);
      }}
    >
      {faculties.map((f, index) => (
        <Select.Option key={index} value={f.id}>
          {f.name}
        </Select.Option>
      ))}
    </Select>
  );
});

export default FacultySelection