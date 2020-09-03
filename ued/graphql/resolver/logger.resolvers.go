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

func (r *mutationResolver) ClearAllLogs(ctx context.Context) (bool, error) {
	user := r.GetCurrentUser(ctx)
	if user == nil {
		return false, errors.New("access denied")
	}
	if err := r.DB.Exec("DELETE FROM loggers").Error; err != nil {
		return false, fmt.Errorf("could not remove all logs due error: %s", err.Error())
	}
	return true, nil
}

func (r *queryResolver) Loggers(ctx context.Context, filter *model.LoggerFilter) (*model.LoggerConnection, error) {
	var (
		offset = 0
		limit  = 50
		tx     = r.DB
		res    model.LoggerConnection
	)

	if filter != nil {
		if filter.Limit != nil {
			limit = *filter.Limit
		}
		if filter.Offset != nil {
			offset = *filter.Offset
		}
		if filter.Search != nil {
			s := "%" + strings.ToLower(*filter.Search) + "%"
			tx = tx.Where("LOWER(type) LIKE ?", s)
		}
	}
	if err := tx.Model(&model.Logger{}).Count(&res.Total).Limit(limit).Offset(offset).Find(&res.Nodes).Error; err != nil {
		return nil, err
	}
	return &res, nil
}
