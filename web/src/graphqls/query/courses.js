import {gql} from "apollo-boost";

export const GET_ALL_COURSES = gql `
  query courses($filter: CourseFilter){
    courses(filter: $filter){
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
        teacher{
          id
          firstName
          lastName
        }
        
      }
    }
  }
`