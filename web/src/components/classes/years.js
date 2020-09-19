import React, { useState } from "react";
import { Select } from "antd";
import { gql, useQuery } from "@apollo/client";

const yearsQuery = gql`
  query years {
    years
  }
`;
const Years = (props) => {
  const [selected, setSelected] = useState(props.value);
  const { data, loading } = useQuery(yearsQuery);
  const nodes = data && data.years ? data.years : [];
  return (
    <Select
        style={{minWidth: 100}}
      loading={loading}
      value={selected}
      onChange={(v) => {
        setSelected(v);
        props.onChange(v);
      }}
    >
      {nodes.map((n, index) => (
        <Select.Option key={index} value={n}>
          {n}
        </Select.Option>
      ))}
    </Select>
  );
};

export default Years;
