import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Card, Col, PageHeader, Row } from "antd";
import CourseSelection from "../../components/course/CourseSelection";
import styled from "styled-components";
import ListCourseStudents from "../../components/course/ListCourseStudents";
import ExportCourseStudentsButton from "../../components/course/ExportCourseStudentsButton";
import CourseYears from "../../components/course/CourseYears";
import SemesterSelection from "../../components/course/SemesterSelection";

const Container = styled.div`
  .filter {
    @media (min-width: 991px) {
      .ant-col {
        display: flex;
        align-items: center;
        div.label {
          margin-right: 10px;
        }
      }
    }
    @media (max-width: 991px) {
      .ant-col {
        width: 100%;
        padding-bottom: 15px;
        .ant-select {
          width: 100%;
        }
        button {
          width: 100%;
        }
      }
    }
  }
`;
const AdminCourseStudent = () => {
  const [year, setYear] = useState(null);
  const [semester, setSemester] = useState(null);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();
  const history = useHistory();
  let courseId = query.get("courseId");
  if (courseId) {
    courseId = parseInt(courseId);
  }
  return (
    <Container>
      <PageHeader className="site-page-header" title="Danh sách đăng ký" />
      <Card size={"small"} title={"Tuỳ chọn"}>
        <div className={"filter"}>
          <Row gutter={15}>
            <Col>
              <div className={"label"}>Năm học</div>
              <CourseYears
                onChange={(v) => {
                  setYear(v);
                }}
                style={{ minWidth: 100 }}
              />
            </Col>
            <Col>
              <div className={"label"}>Học kì</div>
              <SemesterSelection
                onChange={(v) => {
                  setSemester(v);
                }}
                style={{ minWidth: 100 }}
              />
            </Col>
            <Col>
              <div className={"label"}>Chọn học phần:</div>
              <CourseSelection
                year={year}
                semester={semester}
                style={{ minWidth: 250 }}
                value={courseId ? courseId : null}
                onChange={(value) => {
                  history.replace(`/admin/courses/students?courseId=${value}`);
                }}
              />
            </Col>
            {courseId && (
              <Col>
                <ExportCourseStudentsButton courseId={courseId} />
              </Col>
            )}
          </Row>
        </div>
      </Card>
      {courseId ? <ListCourseStudents courseId={courseId} /> : null}
    </Container>
  );
};

export default AdminCourseStudent;
