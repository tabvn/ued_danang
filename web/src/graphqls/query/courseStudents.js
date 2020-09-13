import {gql} from "@apollo/client";

export const GET_ALL_COURSE_STUDENTS = gql`
	query getCourseStudents($courseId: ID!, $filter: CourseStudentFilter!){
		courseStudents: getCourseStudents(courseId: $courseId, filter:$filter){
			id
			courseId
			studentId
			student{
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
			createdAt
			teacherNote

		}
	}
`