import { gql } from "@apollo/client";

export const TEACHER_COURSES = gql`
  query teacherCourses {
    teacherCourses {
      id
      code
      title
      scoreConfigure
    }
  }
`;