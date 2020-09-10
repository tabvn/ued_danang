import {gql} from "apollo-boost";

export const TEACHER_COURSES = gql`
	query teacherCourses{
		teacherCourses{
			id
			code
			title
		}
	}
`