import React, { useState } from "react";
import { Card, PageHeader } from "antd";
import TeacherCourseSelection from "../../components/teacher/TeacherCourseSelection";
import styled from "styled-components";
import ScoreConfigureButton, {
  initScoreConfigure,
} from "../../components/course/ScoreConfigureButton";
import { apolloClient } from "../../client";
import { TEACHER_COURSES } from "../../graphqls/query/teacherCourses";
import Scores from "../../components/course/Scores";
import { getTitle } from "../../components/course/ScoreConfigure";

const Container = styled.div`
  .ant-select {
    margin-top: 10px;
    margin-bottom: 10px;
    min-width: 250px;
  }
  .filter {
    @media (min-width: 991px) {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .score-configure {
    @media (min-width: 991px) {
      display: flex;
      align-items: center;
    }
  }
  .score-config-btn {
    @media (min-width: 991px) {
      margin-left: 10px;
    }
  }
  @media (min-width: 991px) {
    .ant-select {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
`;

const TeacherScoreManagement = () => {
  const [courseId, setCourseId] = useState(null);
  const [info, setInfo] = useState(null);
  const getData = (info) => {
    return info.scoreConfigure ? info.scoreConfigure : initScoreConfigure();
  };
  return (
    <Container>
      <PageHeader title={"Quản lý điểm"} />
      <Card title={"Thông tin học phần"}>
        <div className={"filter"}>
          <div style={{ marginRight: 10 }}>Chọn học phần:</div>
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
                // write cache to client
                const cache = apolloClient.readQuery({
                  query: TEACHER_COURSES,
                });
                if (cache) {
                  apolloClient.writeQuery({
                    query: TEACHER_COURSES,
                    data: {
                      teacherCourses: cache.teacherCourses.map((v) => {
                        if (v.id === courseId) {
                          return {
                            ...v,
                            scoreConfigure: values,
                          };
                        }
                        return v;
                      }),
                    },
                  });
                }
              }}
              course={info}
            />
          )}
          {courseId && (
            <div className={"score-configure"}>
              {getData(info)
                .filter((v) => v.status)
                .map((v) => {
                  return (
                    <div style={{ marginLeft: 10 }}>
                      {getTitle(v)}: <strong>{v.value}</strong>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </Card>
      {courseId && <Scores course={info} />}
    </Container>
  );
};

export default TeacherScoreManagement;
