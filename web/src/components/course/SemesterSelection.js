import React, { forwardRef } from "react";
import { Select } from "antd";

const SemesterSelection = forwardRef((props, ref) => {
  return (
    <Select {...props}>
      <Select.Option value={1}>Học kỳ 1</Select.Option>
      <Select.Option value={2}>Học kỳ 2</Select.Option>
      <Select.Option value={3}>Học kỳ hè</Select.Option>
    </Select>
  );
});

export default SemesterSelection;
