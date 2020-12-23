import {gql} from "@apollo/client";

export const LOGIN_MUTATION = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			id
			expiredAt
			user {
				id
				firstName
				lastName
				email
				role
				password
			}
		}
	}
`;
