import {gql} from "apollo-boost";

export const GET_STUDENT_OPEN_COURSES = gql`
	query studentOpenCourses($filter: CourseFilter){
		courses:studentOpenCourses(filter: $filter){
			total
			nodes{
				id
				code
				title
				limit
				lessonDay
				lessonFrom
				lessonTo
				registerCount
				isRegistered
				teacher{
					id
					firstName
					lastName
				}

			}
		}
	}
`