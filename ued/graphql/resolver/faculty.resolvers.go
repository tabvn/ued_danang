package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/tabvn/ued/model"
)

func (r *mutationResolver) CreateFaculty(ctx context.Context, input model.FacultyInput) (*model.Faculty, error) {
	obj := model.Faculty{
		Name: input.Name,
	}
	if err := r.DB.Create(&obj).Error; err != nil {
		return nil, fmt.Errorf("an error: %s", err.Error())
	}
	return &obj, nil
}

func (r *queryResolver) Faculties(ctx context.Context) ([]*model.Faculty, error) {
	var res []*model.Faculty
	if err := r.DB.Find(&res).Error; err != nil {
		return nil, fmt.Errorf("an error: %s", err.Error())
	}
	return res, nil
}
