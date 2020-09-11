import React, {useState} from 'react';
import {Button, notification, Popconfirm} from "antd";
import {useMutation} from "@apollo/react-hooks";
import {gql} from "apollo-boost";

const adminUnregisterCourseMutation = gql`
	mutation adminUnregisterCourse($courseId: ID!, $studentId: ID!){
		adminUnregisterCourse(courseId: $courseId,studentId: $studentId)
	}
`
const AdminUnregisterCourseButton = (props) => {
    const [loading, setLoading] = useState(false)
    const [adminUnregisterCourse] = useMutation(adminUnregisterCourseMutation)
    return (
        <Popconfirm onConfirm={() => {
            setLoading(true)
            adminUnregisterCourse({
                variables: {
                    courseId: props.courseId,
                    studentId: props.studentId,
                }
            }).then(() => {
                setLoading(false)
                props.onDone()
                notification.success({message: "Huỹ đăng ký thành công."})
            }).catch((e) => {
                setLoading(false)
                notification.error({message: `Có lỗi xảy ra: ${e.toString()}`})
            })
        }} title="Bạn có chắc chắn muốn huỷ đăng ký của sinh viên này?" okText="Đồng ý" cancelText="Không đồng ý">
            <Button danger loading={loading} size="small">
                Huỷ đăng ký
            </Button>
        </Popconfirm>
    );
};

export default AdminUnregisterCourseButton;
