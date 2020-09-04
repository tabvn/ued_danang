package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"strings"

	"github.com/tabvn/ued/model"
)

func (r *mutationResolver) CreateClass(ctx context.Context, input model.ClassInput) (*model.Class, error) {
	var (
		faculty model.Faculty
		teacher model.User
	)
	if err := r.DB.Where("id = ?", input.FacultyID).Take(&faculty).Error; err != nil {
		return nil, fmt.Errorf("could not find faculty: %s", err.Error())
	}
	if err := r.DB.Where("id = ?", input.TeacherID).Take(&teacher).Error; err != nil {
		return nil, fmt.Errorf("could not find teacher user: %s", err.Error())
	}
	obj := model.Class{
		Name:      input.Name,
		FacultyID: input.FacultyID,
		Faculty:   &faculty,
		Year:      input.Year,
		TeacherID: input.TeacherID,
		Teacher:   &teacher,
	}
	if err := r.DB.Create(&obj).Error; err != nil {
		return nil, fmt.Errorf("there is an error: %s", err.Error())
	}
	return &obj, nil
}

func (r *queryResolver) Classes(ctx context.Context, filter *model.ClassFilter) (*model.ClassConnection, error) {
	var (
		limit  = 100
		offset = 0
		res    model.ClassConnection
	)
	tx := r.DB
	if filter != nil {
		if filter.Search != nil {
			tx = tx.Where("LOWER(name) LIKE ?", "%"+strings.ToLower(*filter.Search)+"%")
		}
	}
	if err := tx.Model(model.Class{}).Count(&res.Total).Limit(limit).Offset(offset).Preload("Faculty").Preload("Teacher").Find(&res.Nodes).Error; err != nil {
		return nil, err
	}
	return &res, nil
}
