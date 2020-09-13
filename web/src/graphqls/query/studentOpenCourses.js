import {gql} from "@apollo/client";

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
				open
				teacher{
					id
					firstName
					lastName
				}

			}
		}
	}
`