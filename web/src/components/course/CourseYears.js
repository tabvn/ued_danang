import React, { forwardRef } from "react";
import { gql, useQuery } from "@apollo/client";
import { Select } from "antd";

const loadQuery = gql`
  query courseYears {
    courseYears
  }
`;
const CourseYears = forwardRef((props, ref) => {
  const { loading, data } = useQuery(loadQuery);
  return (
    <Select loading={loading} {...props}>
      {data &&
        data.courseYears &&
        data.courseYears.map((y, index) => (
          <Select.Option value={y} key={index}>
            {y}
          </Select.Option>
        ))}
    </Select>
  );
});

export default CourseYears;
