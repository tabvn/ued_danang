import React, { useState } from "react";
import { Button, InputNumber, notification, Popconfirm, Table } from "antd";
import { gql, useMutation, useQuery } from "@apollo/client";
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

const updateScoresMutation = gql`
  mutation updateScores($courseId: ID!, $scores: [ScoreInput!]!) {
    updateScores(courseId: $courseId, scores: $scores)
  }
`;
const Scores = (props) => {
  const { loading, error, data, refetch } = useQuery(scoreQuery, {
    variables: {
      courseId: props.course.id,
    },
  });
  const [active, setActive] = useState(false);
  const [editData, setEditData] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateScores] = useMutation(updateScoresMutation);
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
          title: `${getTitle({ name: scoreConfig[i].name })}(${
            scoreConfig[i].value
          })`,
          dataIndex: [`${scoreConfig[i]}.name`],
          render: (text, record, index) => {
            const name = scoreConfig[i].name;
            return active ? (
              <InputNumber
                onChange={(num) => {
                  setIsChange(true);
                  setEditData((prevState) => {
                    return prevState.map((s, idx) => {
                      if (idx === index) {
                        return {
                          ...s,
                          [name]: num,
                        };
                      }
                      return s;
                    });
                  });
                }}
                value={editData[index][name]}
                min={0}
                max={10}
              />
            ) : (
              <div>{record[name]}</div>
            );
          },
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
            {active && !isChange && (
              <Button
                onClick={() => {
                  setIsChange(false);
                  setActive(false);
                  setEditData([]);
                }}
              >
                Huỷ
              </Button>
            )}
            {active && isChange && (
              <Popconfirm
                onConfirm={() => {
                  setIsChange(false);
                  setActive(false);
                  setEditData([]);
                }}
                cancelText={"Không"}
                okText="Có tôi muốn huỷ"
                title={"Bạn có chắc muốn huỷ điểm đã nhập không?"}
              >
                <Button>Huỷ</Button>
              </Popconfirm>
            )}
            {!active && (
              <Button
                type="primary"
                onClick={() => {
                  setEditData(
                    data.scores.map((s) => {
                      return {
                        studentId: s.student.id,
                        score1: s.score1,
                        score2: s.score2,
                        score3: s.score3,
                        score4: s.score4,
                      };
                    })
                  );
                  setIsChange(false);
                  setActive(true);
                }}
              >
                Nhập điểm
              </Button>
            )}
            {active && (
              <Button
                onClick={() => {
                  setIsLoading(true);
                  updateScores({
                    variables: {
                      courseId: props.course.id,
                      scores: editData,
                    },
                  })
                    .then(() => {
                      refetch().then(() => {
                        setIsLoading(false);
                        setActive(false);
                        setEditData([]);
                        notification.success({
                          message: "Điểm đã được cập nhật thành công",
                        });
                      });
                    })
                    .catch((e) => {
                      setIsLoading(false);
                      notification.error({
                        message: `Có lỗi xảy ra: ${e.toString()}`,
                      });
                    });
                }}
                loading={isLoading}
                style={{ marginLeft: 10 }}
                type="primary"
              >
                Lưu kết quả
              </Button>
            )}
          </div>
        </div>
      )}
      <Table
        scroll={{ x: 1200 }}
        bordered
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
