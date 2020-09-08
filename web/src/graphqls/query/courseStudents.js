import {gql} from "apollo-boost";

export const GET_ALL_COURSE_STUDENTS = gql`
	query getCourseStudents($courseId: ID!, $filter: CourseStudentFilter!){
		courseStudents: getCourseStudents(courseId: $courseId, filter:$filter){
			id
			courseId
			studentId
			student{
				id
				firstName
				lastName
				code
				birthday
				user{
					email
				}
				class{
					name
				}
			}
          createdAt

		}
	}
`