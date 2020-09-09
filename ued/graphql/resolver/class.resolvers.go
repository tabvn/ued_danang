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
		teacher model.Teacher
	)
	if err := r.DB.Where("id = ?", input.FacultyID).Take(&faculty).Error; err != nil {
		return nil, fmt.Errorf("could not find faculty: %s", err.Error())
	}
	if err := r.DB.Where("id = ?", input.TeacherID).Take(&teacher).Error; err != nil {
		return nil, fmt.Errorf("could not find teacher: %s", err.Error())
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

func (r *mutationResolver) UpdateClass(ctx context.Context, id int64, input model.UpdateClassInput) (*model.Class, error) {
	var obj model.Class
	if err := r.DB.Where("id = ?", id).Take(&obj).Error; err != nil {
		return nil, fmt.Errorf("class not found: %s", err.Error())
	}
	if input.Name != nil {
		obj.Name = *input.Name
	}
	if input.TeacherID != nil {
		obj.TeacherID = *input.TeacherID
	}
	if input.FacultyID != nil {
		obj.FacultyID = *input.FacultyID
	}
	if err := r.DB.Save(&obj).Error; err != nil {
		return nil, fmt.Errorf("an error saving class %s", err.Error())
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
