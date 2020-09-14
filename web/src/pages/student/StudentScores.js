import React from "react";
import {PageHeader} from "antd";
import ListStudentScores from "../../components/student/ListStudentScores";

const StudentScores = () => {
  return <div>
    <PageHeader title="kết quả học tập"/>
    <ListStudentScores />
  </div>;
};

export default StudentScores;
