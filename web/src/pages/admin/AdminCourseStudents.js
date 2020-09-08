import React from 'react';
import {useHistory, useLocation} from 'react-router-dom'
import {Button, PageHeader} from "antd";
import CourseSelection from "../../components/course/CourseSelection";
import styled from "styled-components";
import ListCourseStudents from "../../components/course/ListCourseStudents";
import {DownloadOutlined} from "@ant-design/icons";
import ExportCourseStudentsButton from "../../components/course/ExportCourseStudentsButton";

const Container = styled.div`
.filter{
    .ant-select{
        min-width: 300px;
    }
}
`
const AdminCourseStudent = () => {
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery();
    const history = useHistory();
    const courseId = query.get("courseId")
    return (
        <Container>
            <PageHeader className="site-page-header" title="Danh sách đăng ký"/>
            <div className={"filter"}>
                <span>Chọn học phần: </span>
                <CourseSelection value={courseId ? courseId: null} onChange={(value) => {
                    history.push(`/admin/courses/students?courseId=${value}`)
                }}/>
                {courseId && <ExportCourseStudentsButton courseId={courseId}/> }
            </div>
            {courseId ? <ListCourseStudents courseId={courseId} /> : null}
        </Container>
    );
};

export default AdminCourseStudent;
