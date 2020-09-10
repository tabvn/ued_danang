import {gql} from "apollo-boost";

export const TEACHER_COURSE_STUDENTS = gql`
	query teacherCourseStudents($courseId: ID!){
		teacherCourseStudents(courseId: $courseId){
			id
			user{
				id
				email
			}
			class{
				id
				name
			}
			firstName
			lastName
			code
			birthday
			gender
			classId
		}
	}

`