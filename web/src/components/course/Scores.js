import React, { useState } from "react";
import { Button, InputNumber, Table } from "antd";
import { gql, useQuery } from "@apollo/client";
import ErrorMessage from "../ErrorMessage";
import { initScoreConfigure } from "./ScoreConfigureButton";
import { getTitle } from "./ScoreConfigure";

const scoreQuery = gql`
  query scores($courseId: ID!) {
    scores(courseId: $courseId) {
      id
      student {
        id
        user {
          id
          email
        }
        class {
          id
          name
        }
        firstName
        lastName
        code
        birthday
        gender
        classId
      }
      score
      score1
      score2
      score3
      score4
    }
  }
`;
const Scores = (props) => {
  const { loading, error, data } = useQuery(scoreQuery, {
    variables: {
      courseId: props.course.id,
    },
  });
  const [active, setActive] = useState(false);
  if (error) return <ErrorMessage error={error}>Error!</ErrorMessage>;
  let columns = [
    {
      title: "Mã SV",
      dataIndex: ["student", "code"],
    },
    {
      title: "Họ và tên",
      render: (text, record) => (
        <div>{`${record.student.lastName} ${record.student.firstName}`}</div>
      ),
    },
    {
      title: "Giới tính",
      render: (text, record) => (
        <div>{`${record.student.gender ? "Name" : "Nữ"}`}</div>
      ),
    },
    {
      title: "Email",
      dataIndex: ["student", "user", "email"],
    },
  ];
  const scoreConfig = props.course.scoreConfigure
    ? props.course.scoreConfigure
    : initScoreConfigure();
  let configMap = {};
  for (let i = 0; i < scoreConfig.length; i++) {
    if (scoreConfig[i].status) {
      configMap[scoreConfig[i].name] = true;
      columns = [
        ...columns,
        {
          title: getTitle({ name: scoreConfig[i].name }),
          dataIndex: [`${scoreConfig[i]}.name`],
          render: (text, record, index) =>
            active ? (
              <InputNumber min={0} max={10} />
            ) : (
              <div>{record[scoreConfig[i].name]}</div>
            ),
        },
      ];
    }
  }
  return (
    <div>
      {data && data.scores && data.scores.length && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            justifyItems: "center",
            paddingTop: 15,
            paddingBottom: 15,
          }}
        >
          <div>
            <Button onClick={() => setActive(!active)}>
              {!active ? "Nhập điểm" : "Huỷ"}
            </Button>
            {
              active && (
                  <Button style={{marginLeft: 10}} type="primary">Lưu kết quả</Button>
              )
            }
          </div>
        </div>
      )}
      <Table
        loading={loading}
        pagination={false}
        rowKey={(_, index) => index}
        columns={columns}
        dataSource={data ? data.scores : []}
      />
    </div>
  );
};

export default Scores;
