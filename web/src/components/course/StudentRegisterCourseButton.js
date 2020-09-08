import React, {useState} from 'react';
import {useMutation} from "@apollo/react-hooks";
import {gql} from "apollo-boost";
import {Button, notification} from "antd";

const registerCourseMutation = gql`
	mutation registerCourse($courseId: ID!){
		registerCourse(courseId: $courseId){
			id
			studentId
			createdAt
			updatedAt
		}
	}
`

const unregisterCourseMutation = gql`
	mutation unregisterCourse($courseId: ID!){
		unregisterCourse(courseId: $courseId)
	}
`

const StudentRegisterCourseButton = (props) => {
    const {course} = props
    const [loading, setLoading] = useState(false)
    const [registerCourse] = useMutation(registerCourseMutation)
    const [unregisterCourse] = useMutation(unregisterCourseMutation)
    return (
        <div>
            {course.isRegistered ?
                <Button loading={loading} danger size="small" onClick={() => {
                    setLoading(true)
                    unregisterCourse({
                        variables: {
                            courseId: course.id,
                        }
                    }).then(() => {
                        setLoading(false)
						notification.success({message: `Bạn đã huỷ học phần ${course.title}`})
                        props.onDone()
                    }).catch((err) => {
                        setLoading(false)
                        if (err.toString().includes("course is closed")){
							notification.error({message: `có lỗi xảy ra: học phần này đã khoá`})
						}else{
							notification.error({message: `có lỗi xảy ra: ${err.toString()}`})
						}

                    })
                }}>Huỷ đăng ký</Button> :
                <Button onClick={() => {
                    setLoading(true)
                    registerCourse({
                        variables: {
                            courseId: course.id
                        }
                    }).then(() => {
                        setLoading(false)
                        notification.success({message: "Đăng ký thành công"})
                        props.onDone()
                    }).catch((err) => {
                        setLoading(false)
                        if (err.toString().includes('course is overlap')) {
                            notification.error({message: `có lỗi xảy ra: trùng lịch học`})
                        } else if (err.toString().includes('course is closed')) {
                            notification.error({message: "Học phần này đã dừng đăng ký"})
                        } else {
                            notification.error({message: `có lỗi xảy ra: ${err.toString()}`})
                        }
                    })
                }} size="small" loading={loading}>
                    Đăng ký
                </Button>}

        </div>
    );
};

export default StudentRegisterCourseButton;
