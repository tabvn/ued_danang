import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { PageHeader } from "antd";
import CourseSelection from "../../components/course/CourseSelection";
import styled from "styled-components";
import ListCourseStudents from "../../components/course/ListCourseStudents";
import ExportCourseStudentsButton from "../../components/course/ExportCourseStudentsButton";

const Container = styled.div`
  .ant-select {
    min-width: 100%;
    margin-bottom: 10px;
  }
  .filter {
    .filter-label {
       margin-right: 0;
    }
  }
  @media(min-width: 991px){
  .ant-select{
    min-width: 300px;
    margin-bottom: 0;
  }
  }
  .filter {
    @media (min-width: 991px) {
      display: flex;
      align-items: center;
      justify-items: center;
      .filter-label{
        margin-right: 10px;
      }
    }
  }
`;
const AdminCourseStudent = () => {
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
      <PageHeader className="site-page-header" title="Đánh giá học phần" />
      <div className={"filter"}>
        <div className="filter-label">Chọn Năm: </div>
        <CourseSelection
          value={courseId ? courseId : null}
          onChange={(value) => {
            history.replace(`/admin/courses/students?courseId=${value}`);
          }}
        />
        {courseId && <ExportCourseStudentsButton courseId={courseId} />}
      </div>
      {courseId ? <ListCourseStudents courseId={courseId} /> : null}
    </Container>
  );
};

export default AdminCourseStudent;
