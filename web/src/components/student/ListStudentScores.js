import React, { useState } from "react";
import { Button, Modal, Table } from "antd";
import { gql, useQuery } from "@apollo/client";
import ScoreView from "../course/ScoreView";

const studentScoresQuery = gql`
  query studentScores {
    studentScores {
      id
      course {
        id
        code
        title
        unit
        required
        scoreConfigure
      }
      score
      score1
      score2
      score3
      score4
    }
  }
`;
const ListStudentScores = () => {
  const { data, loading } = useQuery(studentScoresQuery);
  const [view, setView] = useState(null);
  const columns = [
    {
      title: "Mã học phần",
      dataIndex: ["course", "code"],
    },
    {
      title: "Học phần",
      dataIndex: ["course", "title"],
    },
    {
      title: "Học phần bắt buộc",
      render: (text, record) => (
        <div>{record.course.required ? "Bắt buộc" : "Tự chọn"}</div>
      ),
    },
    {
      title: "số tín chỉ",
      dataIndex: ["course", "unit"],
    },
    {
      title: "Điểm hệ số 10",
      key: "score",
      dataIndex: "score",
    },
    {
      title: "",
      render: (text, record) => {
        if (record.score === null) {
          return null;
        }
        return (
          <Button
            onClick={() => {
              setView(record);
            }}
            size="small"
          >
            Xem chi tiết
          </Button>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        scroll={{
          x: 1200,
        }}
        pagination={false}
        loading={loading}
        columns={columns}
        dataSource={data ? data.studentScores : []}
      />
      {view && (
        <Modal
          width={window.innerWidth < 700 ? window.innerWidth : 700}
          onCancel={() => setView(null)}
          footer={null}
          visible={true}
          title={`Chi tiết điểm học phần: ${view.course.title}`}
        >
          <ScoreView
            course={view.course}
            score={view}
            configure={view.course.configure}
          />
        </Modal>
      )}
    </div>
  );
};

export default ListStudentScores;
