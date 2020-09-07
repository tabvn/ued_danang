package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/tabvn/ued/model"
)

func (r *mutationResolver) CreateCourse(ctx context.Context, input model.CourseInput) (*model.Course, error) {
	var (
		teacher   model.Teacher
		faculties []*model.Faculty
	)
	if err := r.DB.Where("id = ?", input.TeacherID).Take(&teacher).Error; err != nil {
		return nil, fmt.Errorf("teacher not found: %s", err.Error())
	}
	if err := r.DB.Where("id IN (?)", input.Faculties).Find(&faculties).Error; err != nil {
		return nil, fmt.Errorf("faculties not found %s", err.Error())
	}
	obj := model.Course{
		Code:          input.Code,
		Required:      input.Required,
		Limit:         input.Limit,
		TeacherID:     input.TeacherID,
		Teacher:       &teacher,
		Faculties:     faculties,
		Title:         input.Title,
		LessonDay:     input.LessonDay,
		LessonFrom:    input.LessonFrom,
		LessonTo:      input.LessonTo,
		Unit:          input.Unit,
		Open:          input.Open,
		RegisterCount: 0,
	}
	if err := r.DB.Create(&obj).Error; err != nil {
		return nil, fmt.Errorf("could not create course due an error: %s", err.Error())
	}
	return &obj, nil
}

func (r *mutationResolver) RegisterCourse(ctx context.Context, courseID int64) (*model.CourseStudent, error) {
	student := r.GetStudentFromContext(ctx)
	if student == nil {
		return nil, fmt.Errorf("access denied")
	}
	var course model.Course
	if err := r.DB.Where("id = ?", courseID).Take(&course).Error; err != nil {
		return nil, fmt.Errorf("course not found")
	}
	if course.GetRegisterCount() >= course.Limit {
		return nil, fmt.Errorf("course is full could not register new student")
	}
	var count int64
	if err := r.DB.Model(model.Course{}).Joins("INNER JOIN course_students ON course_students.course_id = \"courses\".id AND course_students.student_id = ?", student.ID).Where("courses.lesson_day = ? AND (courses.lesson_to >= ? AND courses.lesson_to <= ?)",course.LessonDay, course.LessonFrom, course.LessonTo).Count(&count).Error; err != nil {
		return nil, fmt.Errorf("an error %s", err.Error())
	}
	if count > 0 {
		return nil, errors.New("course is overlap")
	}
	obj := model.CourseStudent{
		ID:        0,
		StudentID: student.ID,
		Student:   student,
		CourseID:  course.ID,
		Course:    &course,
	}
	if err := r.DB.Create(&obj).Error; err != nil {
		return nil, fmt.Errorf("could not register due an error: %s", err.Error())
	}
	return &obj, nil
}

func (r *mutationResolver) UnregisterCourse(ctx context.Context, courseID int64) (bool, error) {
	student := r.GetStudentFromContext(ctx)
	if student == nil {
		return false, errors.New("access denied")
	}
	if err := r.DB.Exec("DELETE FROM course_students WHERE student_id = ? AND course_id = ?", student.ID, courseID).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (r *queryResolver) Courses(ctx context.Context, filter *model.CourseFilter) (*model.CourseConnection, error) {
	var (
		res    model.CourseConnection
		limit  = 100
		offset = 0
	)
	tx := r.DB.Model(model.Course{})
	if filter != nil {
		if filter.Limit != nil {
			limit = *filter.Limit
		}
		if filter.Offset != nil {
			offset = *filter.Offset
		}
		if filter.Search != nil {
			s := "%" + strings.ToLower(*filter.Search) + "%"
			tx = tx.Where("code LIKE ? OR title LIKE ?", s, s)
		}
	}
	if err := tx.Count(&res.Total).Limit(limit).Offset(offset).Preload("Teacher").Preload("Teacher.User").Find(&res.Nodes).Error; err != nil {
		return nil, fmt.Errorf("an error: %s", err.Error())
	}
	if res.Nodes != nil {
		for _, c := range res.Nodes {
			c.RegisterCount = c.GetRegisterCount()
		}
	}
	return &res, nil
}

func (r *queryResolver) StudentOpenCourses(ctx context.Context, filter *model.CourseFilter) (*model.CourseConnection, error) {
	var student = r.GetStudentFromContext(ctx)
	if student == nil {
		return nil, fmt.Errorf("you are not a student")
	}
	var (
		res    model.CourseConnection
		limit  = 100
		offset = 0
	)
	tx := r.DB.Model(model.Course{})
	if filter != nil {
		if filter.Limit != nil {
			limit = *filter.Limit
		}
		if filter.Offset != nil {
			offset = *filter.Offset
		}
		if filter.Search != nil {
			s := "%" + strings.ToLower(*filter.Search) + "%"
			tx = tx.Where("code LIKE ? OR title LIKE ?", s, s)
		}
	}
	if err := tx.Count(&res.Total).Limit(limit).Offset(offset).Preload("Teacher").Preload("Teacher.User").Find(&res.Nodes).Error; err != nil {
		return nil, fmt.Errorf("an error: %s", err.Error())
	}
	if res.Nodes != nil {
		for _, c := range res.Nodes {
			c.RegisterCount = c.GetRegisterCount()
			c.IsRegistered = c.StudentIsRegistered(student.ID)
		}
	}
	return &res, nil
}

func (r *queryResolver) GetCourseStudents(ctx context.Context, courseID int64, filter model.CourseStudentFilter) ([]*model.CourseStudent, error) {
	var res []*model.CourseStudent
	if err := r.DB.Where("course_id = ?", courseID).
		Preload("Student").
		Preload("Student.User").
		Find(&res).Error; err != nil {
		return nil, fmt.Errorf("could not find students register in this course due an error: %s", err.Error())
	}
	return res, nil
}
