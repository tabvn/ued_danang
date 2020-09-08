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
        unit
        required
        lessonDay
        lessonFrom
        lessonTo
        registerCount
        teacherId
        open
        faculties{
          id
          name
        }
        teacher{
          id
          firstName
          lastName
        }
        
      }
    }
  }
`