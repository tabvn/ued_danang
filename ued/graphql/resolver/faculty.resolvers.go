package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
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

func (r *mutationResolver) UpdateFaculty(ctx context.Context, id int64, input model.FacultyInput) (*model.Faculty, error) {
	currentUser := r.GetCurrentUser(ctx)
	if currentUser == nil {
		return nil, fmt.Errorf("access denied")
	}
	if !currentUser.IsAdministrator() {
		return nil, errors.New("access denied")
	}
	var obj model.Faculty
	if err := r.DB.Where("id = ?", id).Find(&obj).Error; err != nil {
		return nil, fmt.Errorf("faculty not found")
	}
	obj.Name = input.Name
	if err := r.DB.Save(&obj).Error; err != nil {
		return nil, fmt.Errorf("could not save faculty due an error: %s", err.Error())
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
