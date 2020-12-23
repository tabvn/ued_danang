package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"strings"

	"github.com/tabvn/ued/model"
)

func (r *mutationResolver) CreateStudent(ctx context.Context, input model.StudentInput) (*model.Student, error) {
	var (
		c model.Class
	)
	if err := r.DB.Where("id = ?", input.ClassID).Take(&c).Error; err != nil {
		return nil, fmt.Errorf("class not found")
	}
	tx := r.DB.Begin()
	user, err := r.CreateUser(tx, model.RoleStudent.String(), input.FirstName, input.LastName, input.Email, input.Password)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("could not create user due an error: %s", err.Error())
	}
	obj := model.Student{
		ClassID:   c.ID,
		Class:     &c,
		UserID:    user.ID,
		User:      user,
		Code:      input.Code,
		Year:      input.Year,
		FirstName: strings.TrimSpace(input.FirstName),
		LastName:  strings.TrimSpace(input.LastName),
		Gender:    input.Gender,
		Birthday:  input.Birthday,
	}
	if err := tx.Create(&obj).Error; err != nil {
		tx.Rollback()
		return nil, err
	}
	tx.Commit()
	return &obj, nil
}

func (r *mutationResolver) UpdateStudent(ctx context.Context, id int64, input model.UpdateStudentInput) (*model.Student, error) {
	var obj model.Student
	if err := r.DB.Where("id = ?", id).Preload("User").Take(&obj).Error; err != nil {
		return nil, fmt.Errorf("student not found %s", err.Error())
	}
	var tx = r.DB.Begin()
	if input.FirstName != nil {
		obj.User.FirstName = strings.TrimSpace(*input.FirstName)
		obj.FirstName = obj.User.FirstName
	}
	if input.LastName != nil {
		obj.User.LastName = strings.TrimSpace(*input.LastName)
		obj.LastName = obj.User.LastName
	}
	if input.Email != nil {
		obj.User.Email = strings.TrimSpace(*input.Email)
	}
	if input.Password != nil {
		obj.User.Password = model.EncodePassword(*input.Password)
	}
	if err := tx.Save(obj.User).Error; err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("could not save user info due an error: %s", err.Error())
	}
	if input.Code != nil {
		obj.Code = *input.Code
	}
	if input.ClassID != nil {
		obj.ClassID = *input.ClassID
	}
	if input.Gender != nil {
		obj.Gender = *input.Gender
	}
	if input.Birthday != nil {
		obj.Birthday = *input.Birthday
	}
	if input.Year != nil {
		obj.Year = *input.Year
	}
	if err := tx.Save(&obj).Error; err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("could not save student: %s", err.Error())
	}
	tx.Commit()
	return &obj, nil
}

func (r *queryResolver) Students(ctx context.Context, filter *model.StudentFilter) (*model.StudentConnection, error) {
	var (
		limit  = 100
		offset = 0
		res    model.StudentConnection
	)
	tx := r.DB
	if filter != nil {
		if filter.Search != nil {
			s := "%" + strings.ToLower(*filter.Search) + "%"
			tx = tx.Where("LOWER(students.first_name) LIKE ? OR LOWER(students.last_name) LIKE ? OR students.code = ?", s, s, *filter.Search)
		}
		if filter.ClassID != nil {
			tx = tx.Where("students.class_id = ?", *filter.ClassID)
		}
		if filter.Year != nil {
			tx = tx.Where("students.year = ?", *filter.Year)
		}
	}
	if err := tx.Model(&model.Student{}).Count(&res.Total).Limit(limit).Offset(offset).Joins("Class").Joins("User").Find(&res.Nodes).Error; err != nil {
		return nil, err
	}
	return &res, nil
}
