package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"github.com/360EntSecGroup-Skylar/excelize"
	"github.com/tabvn/ued/id"
	"github.com/tabvn/ued/storage"
	"log"
	"os"
	"strings"

	"github.com/tabvn/ued/model"
)

func (r *mutationResolver) CreateCourse(ctx context.Context, input model.CourseInput) (*model.Course, error) {
	currentUser := r.GetCurrentUser(ctx)
	if currentUser == nil {
		return nil, errors.New("access denied")
	}
	if !currentUser.IsAdministrator() {
		return nil, errors.New("access denied")
	}
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

func (r *mutationResolver) UpdateCourse(ctx context.Context, id int64, input model.UpdateCourseInput) (*model.Course, error) {
	currentUser := r.GetCurrentUser(ctx)
	if currentUser == nil {
		return nil, errors.New("access denied")
	}
	if !currentUser.IsAdministrator() {
		return nil, errors.New("access denied")
	}
	var course model.Course
	if err := r.DB.Where("id = ?", id).Take(&course).Error; err != nil {
		return nil, fmt.Errorf("course not found: %s", err.Error())
	}
	var (
		teacher   model.Teacher
		faculties []*model.Faculty
	)
	tx := r.DB.Begin()
	if input.Faculties != nil {
		if err := tx.Where("id IN (?)", input.Faculties).Find(&faculties).Error; err != nil {
			tx.Rollback()
			return nil, fmt.Errorf("faculties not found %s", err.Error())
		}
		if err := tx.Exec("DELETE FROM course_faculties WHERE course_id = ?", course.ID).Error; err != nil {
			tx.Rollback()
			return nil, fmt.Errorf("could not remove course_faculties: %s", err.Error())
		}
		course.Faculties = faculties
	}
	if input.Code != nil {
		course.Code = *input.Code
	}
	if input.Required != nil {
		course.Required = *input.Required
	}
	if input.Limit != nil {
		course.Limit = *input.Limit
	}
	if input.TeacherID != nil {
		course.TeacherID = *input.TeacherID
		if err := tx.Where("id = ?", input.TeacherID).Take(&teacher).Error; err != nil {
			tx.Rollback()
			return nil, fmt.Errorf("teacher not found: %s", err.Error())
		}
		course.Teacher = &teacher
	}
	if input.Title != nil {
		course.Title = *input.Title
	}
	if input.LessonDay != nil {
		course.LessonDay = *input.LessonDay
	}
	if input.LessonFrom != nil {
		course.LessonFrom = *input.LessonFrom
	}
	if input.LessonTo != nil {
		course.LessonTo = *input.LessonTo
	}
	if input.Unit != nil {
		course.Unit = *input.Unit
	}
	if input.Open != nil {
		course.Open = *input.Open
	}
	if err := tx.Save(&course).Error; err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("an error saving course: %s", err.Error())
	}
	tx.Commit()
	return &course, nil
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
	if course.Open == false {
		return nil, fmt.Errorf("course is closed")
	}
	var count int64
	if err := r.DB.Model(model.Course{}).Joins("INNER JOIN course_students ON course_students.course_id = \"courses\".id AND course_students.student_id = ?", student.ID).Where("courses.lesson_day = ? AND (courses.lesson_to >= ? AND courses.lesson_to <= ?)", course.LessonDay, course.LessonFrom, course.LessonTo).Count(&count).Error; err != nil {
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
	var course model.Course
	if err := r.DB.Where("id = ?", courseID).Take(&course).Error; err != nil {
		return false, fmt.Errorf("course not found")
	}
	if course.Open == false {
		return false, fmt.Errorf("course is closed")
	}
	if err := r.DB.Exec("DELETE FROM course_students WHERE student_id = ? AND course_id = ?", student.ID, courseID).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (r *mutationResolver) ExportCourseStudents(ctx context.Context, courseID int64) (*string, error) {
	var (
		course         model.Course
		courseStudents []*model.CourseStudent
	)
	if err := r.DB.Where("id = ?", courseID).Take(&course).Error; err != nil {
		return nil, fmt.Errorf("course not found")
	}
	if err := r.DB.Model(model.CourseStudent{}).Joins("INNER JOIN students on students.id = course_students.student_id").Where("course_id = ?", courseID).
		Preload("Student").
		Preload("Student.User").
		Preload("Student.Class").
		Order("students.first_name ASC").
		Find(&courseStudents).Error; err != nil {
		return nil, fmt.Errorf("could not find students register in this course due an error: %s", err.Error())
	}
	log.Println(courseStudents)
	f := excelize.NewFile()
	sheet := "Sheet1"
	f.SetColWidth(sheet, "A", "E", 30)
	f.SetCellValue(sheet, "A1", "Mã sinh viên")
	f.SetCellValue(sheet, "B1", "Họ và tên")
	f.SetCellValue(sheet, "C1", "Ngày sinh")
	f.SetCellValue(sheet, "D1", "Lớp sinh hoạt")
	f.SetCellValue(sheet, "E1", "Ghi chú")
	for index, c := range courseStudents {
		if c.Student == nil {
			continue
		}
		if c.Student.Class == nil {
			continue
		}
		f.SetCellValue(sheet, fmt.Sprintf("A%d", index+2), c.Student.Code)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", index+2), c.Student.LastName+" "+c.Student.FirstName)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", index+2), c.Student.Birthday.Format("02/01/2006"))
		f.SetCellValue(sheet, fmt.Sprintf("D%d", index+2), c.Student.Class.Name)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", index+2), "")
	}
	// Save xlsx file by the given path.
	key := id.Gen(20) + "_" + course.Code + "_sinh_vien.xlsx"
	os.MkdirAll(storage.UploadDir(), 0775)
	if err := f.SaveAs(storage.UploadDir() + "/" + key); err != nil {
		fmt.Println(err)
		return nil, fmt.Errorf("could not save file due an error: %s", err.Error())
	}
	return &key, nil
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
	if err := tx.Count(&res.Total).Limit(limit).Offset(offset).Preload("Faculties").Preload("Teacher").Preload("Teacher.User").Find(&res.Nodes).Error; err != nil {
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
	c := student.GetClass()
	if c == nil {
		return nil, fmt.Errorf("your class is not found")
	}
	tx := r.DB.Model(model.Course{}).Select("DISTINCT courses.*").Joins("INNER JOIN course_faculties ON course_faculties.course_id = courses.id AND course_faculties.faculty_id = ?", c.FacultyID)
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
	if err := r.DB.Model(model.CourseStudent{}).Joins("INNER JOIN students on students.id = course_students.student_id").Where("course_id = ?", courseID).
		Preload("Student").
		Preload("Student.User").
		Preload("Student.Class").
		Order("students.first_name ASC").
		Find(&res).Error; err != nil {
		return nil, fmt.Errorf("could not find students register in this course due an error: %s", err.Error())
	}
	return res, nil
}
