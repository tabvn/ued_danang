import {gql} from "@apollo/client";

export const GET_FACULTIES = gql`
	query faculties{
		faculties{
			id
			name
		}
	}
`