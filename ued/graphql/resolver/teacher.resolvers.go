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
		WorkPlace: input.Workplace,
	}
	if err := tx.Create(&obj).Error; err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("could not create teacher due an error: %s", err.Error())
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
	if err := tx.Model(model.Teacher{}).Count(&res.Total).Limit(limit).Offset(offset).Find(&res.Nodes).Error; err != nil {
		return nil, err
	}
	return &res, nil
}
