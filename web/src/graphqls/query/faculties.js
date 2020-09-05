import {gql} from "apollo-boost";

export const GET_FACULTIES = gql`
	query faculties{
		faculties{
			id
			name
		}
	}
`