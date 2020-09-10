import {gql} from "apollo-boost";

export const GET_CLASSES = gql`
	query classes($filter:ClassFilter){
		classes(filter: $filter){
			total
			nodes{
				id
				name
				teacherId
				facultyId
				faculty{
					id
					name
				}
				teacher{
					id
					firstName
					lastName
				}
				year
			}
		}
	}
`

export const TEACHER_CLASSES = gql`
	query teacherClasses{
		teacherClasses{
			id
			name
			teacherId
			facultyId
			faculty{
				id
				name
			}
			teacher{
				id
				firstName
				lastName
			}
			year
		}
	}
`