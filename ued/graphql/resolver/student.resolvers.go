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
	tx := r.DB.Begin()
	user, err := r.CreateUser(tx, input.Email, input.Password)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("could not create user due an error: %s", err.Error())
	}
	obj := model.Student{
		UserID:    user.ID,
		User:      user,
		Code:      input.Code,
		FirstName: input.FirstName,
		LastName:  input.LastName,
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
			tx = tx.Where("LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ?", s, s)
		}
	}
	if err := tx.Model(model.Student{}).Count(&res.Total).Limit(limit).Offset(offset).Find(&res.Nodes).Error; err != nil {
		return nil, err
	}
	return &res, nil
}
