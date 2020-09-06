import {gql} from "apollo-boost";

export const GET_CLASSES = gql`
	query students($filter:ClassFilter){
		classes(filter: $filter){
			total
			nodes{
				id
				name
				teacher{
					id
					firstName
					lastName
				}
			}
		}
	}
`