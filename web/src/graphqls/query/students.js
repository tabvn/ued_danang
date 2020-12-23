import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query students($filter: StudentFilter) {
    students(filter: $filter) {
      total
      nodes {
        id
        user {
          id
          email
        }
        class {
          id
          name
        }
        firstName
        lastName
        code
        birthday
        gender
        classId
        year
      }
    }
  }
`;