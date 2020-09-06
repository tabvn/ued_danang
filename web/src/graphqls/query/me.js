import {gql} from "apollo-boost";

export const ME_QUERY = gql`
	query viewer {
		viewer {
			user{
				id
				email
				firstName
				lastName
				role
			}
			student{
				id
				firstName
				lastName
				code
			}
			teacher{
				id
				firstName
				lastName
			}
		}
	}
`;
