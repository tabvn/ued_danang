import React, { useState } from "react";
import { Card, PageHeader } from "antd";
import TeacherCourseSelection from "../../components/teacher/TeacherCourseSelection";
import styled from "styled-components";
import ScoreConfigureButton from "../../components/course/ScoreConfigureButton";

const Container = styled.div`
  .ant-select {
    min-width: 250px;
  }
`;

const TeacherScoreManagement = () => {
  const [courseId, setCourseId] = useState(null);
  const [info, setInfo] = useState(null);
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <PageHeader title={"Quản lý điểm"} />
      <Card title={"Thông tin học phần"}>
        <span>Chọn học phần: </span>
        <TeacherCourseSelection
          onChange={(id, inf) => {
            setCourseId(id);
            setInfo(inf);
          }}
        />
        {courseId && (
          <ScoreConfigureButton
            onChange={(values) => {
              setInfo((prevState) => {
                return { ...prevState, scoreConfigure: values };
              });
            }}
            course={info}
          />
        )}
      </Card>
    </Container>
  );
};

export default TeacherScoreManagement;
