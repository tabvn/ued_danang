package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"strings"

	"github.com/tabvn/ued/model"
)

func (r *mutationResolver) CreateTeacher(ctx context.Context, input model.TeacherInput) (*model.Teacher, error) {
	tx := r.DB.Begin()
	user, err := r.CreateUser(tx, input.FirstName, input.LastName, input.Email, input.Password)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("could not create user due an error: %s", err.Error())
	}
	obj := model.Teacher{
		UserID:    user.ID,
		User:      user,
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Phone:     input.Phone,
		WorkPlace: input.WorkPlace,
	}
	if err := tx.Create(&obj).Error; err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("could not create teacher due an error: %s", err.Error())
	}
	tx.Commit()
	return &obj, nil
}

func (r *mutationResolver) UpdateTeacher(ctx context.Context, id int64, input model.UpdateTeacherInput) (*model.Teacher, error) {
	currentUser := r.GetCurrentUser(ctx)
	if currentUser == nil {
		return nil, fmt.Errorf("access denied")
	}
	if !currentUser.IsAdministrator() {
		return nil, fmt.Errorf("access denied")
	}
	var obj model.Teacher
	if err := r.DB.Where("id = ?", id).Preload("User").Take(&obj).Error; err != nil {
		return nil, fmt.Errorf("could not find teacher due an error: %s", err.Error())
	}
	obj.FirstName = input.FirstName
	obj.LastName = input.LastName
	obj.Phone = input.Phone
	obj.WorkPlace = input.WorkPlace
	obj.User.FirstName = input.FirstName
	obj.User.LastName = input.LastName
	obj.User.Email = input.Email
	var tx = r.DB.Begin()
	if err := tx.Save(obj.User).Error; err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("could not save user due an error: %s", err.Error())
	}
	if err := tx.Save(&obj).Error; err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("could not save teacher due an error %s", err.Error())
	}
	tx.Commit()
	return &obj, nil
}

func (r *queryResolver) Teachers(ctx context.Context, filter *model.TeacherFilter) (*model.TeacherConnection, error) {
	var (
		limit  = 100
		offset = 0
		res    model.TeacherConnection
	)
	tx := r.DB
	if filter != nil {
		if filter.Search != nil {
			s := "%" + strings.ToLower(*filter.Search) + "%"
			tx = tx.Where("LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ?", s, s)
		}
	}
	if err := tx.Model(model.Teacher{}).Count(&res.Total).Limit(limit).Offset(offset).Preload("User").Find(&res.Nodes).Error; err != nil {
		return nil, err
	}
	return &res, nil
}
