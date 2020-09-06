import {gql} from "apollo-boost";

export const GET_ALL_TEACHERS = gql`	
	query teachers($filter: TeacherFilter){
		teachers(filter: $filter){
			total
			nodes{
				id
				firstName
				lastName
				phone
				workPlace
				userId
				user{
					id
					email
				}
				
			}
		}
	}
`