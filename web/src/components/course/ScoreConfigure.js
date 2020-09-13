import React, { useEffect, useState } from "react";
import { InputNumber, Switch, Table } from "antd";

const ScoreConfigure = (props) => {
  const [dataSource, setDataSource] = useState(props.value ? props.value : []);
  const getTitle = (record) => {
    switch (record.name) {
      case "score1":
        return "Điểm bộ phận 1";

      case "score2":
        return "Điểm bộ phận 2";

      case "score3":
        return "Điểm giữa kì";
      case "score4":
        return "Điểm cuối kì";

      default:
        return record.name;
    }
  };

  useEffect(() => {
    props.onChange(dataSource);
  }, [dataSource]);
  const columns = [
    {
      title: "Tên điểm bộ phận",
      dataIndex: "name",
      render: (text, record) => {
        return <div>{getTitle(record)}</div>;
      },
    },
    {
      title: "Hệ số điểm",
      render: (text, record, index) => (
        <InputNumber
          disabled={!record.status}
          value={record.value}
          onChange={(num) => {
            setDataSource((prevState) => {
              return prevState.map((v, idx) => {
                if (idx === index) {
                  return {
                    ...v,
                    value: num,
                  };
                }
                return v;
              });
            });
          }}
          min={0.1}
          max={1}
        />
      ),
    },
    {
      title: "Trạng thái",
      render: (text, record, index) => (
        <Switch
          checked={record.status}
          onChange={(checked) => {
            setDataSource((prevState) => {
              return prevState.map((v, idx) => {
                if (idx === index) {
                  return {
                    ...v,
                    status: checked,
                  };
                }
                return v;
              });
            });
          }}
        />
      ),
    },
  ];
  return (
    <Table
      rowKey={(_, index) => index}
      pagination={false}
      columns={columns}
      dataSource={dataSource}
    />
  );
};

export default ScoreConfigure;
