import React from 'react';
import {useHistory, useLocation} from 'react-router-dom'
import {PageHeader} from "antd";
import CourseSelection from "../../components/course/CourseSelection";
import styled from "styled-components";
import ListCourseStudents from "../../components/course/ListCourseStudents";
import ExportCourseStudentsButton from "../../components/course/ExportCourseStudentsButton";
import {APP_URL} from "../../config";

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
    let courseId = query.get("courseId")
    if (courseId) {
        courseId = parseInt(courseId)
    }
    return (
        <Container>
            <PageHeader className="site-page-header" title="Danh sách đăng ký"/>
            <div className={"filter"}>
                <span>Chọn học phần: </span>
                <CourseSelection value={courseId ? courseId : null} onChange={(value) => {
                    if(!courseId){
                        window.location.href = `${APP_URL}/admin/courses/students?courseId=${value}`
                    }else{
                        history.replace(`/admin/courses/students?courseId=${value}`)
                    }

                }}/>
                {courseId && <ExportCourseStudentsButton courseId={courseId}/>}
            </div>
            {courseId ? <ListCourseStudents courseId={courseId}/> : null}
        </Container>
    );
};

export default AdminCourseStudent;
