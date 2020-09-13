package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/tabvn/ued/auth"
	"github.com/tabvn/ued/model"
)

func (r *mutationResolver) Login(ctx context.Context, email string, password string) (*model.Token, error) {
	var (
		user model.User
	)
	if err := r.DB.Where("email = ?", email).Take(&user).Error; err != nil {
		return nil, fmt.Errorf("invalid email or password")
	}
	if !model.ComparePassword(password, user.Password) {
		return nil, errors.New("password does not match")
	}
	expired := time.Now().Add(time.Second * 3600 * 24 * 7)
	key, err := auth.SignIn(user.ID, expired.Unix())
	if err != nil {
		return nil, fmt.Errorf("could not generate jwt token: %s", err.Error())
	}
	user.Password = ""
	return &model.Token{
		ID:        key,
		ExpiredAt: expired,
		User:      &user,
	}, nil
}

func (r *mutationResolver) ChangePassword(ctx context.Context, newPassword string) (bool, error) {
	var user = r.GetCurrentUser(ctx)
	if user == nil {
		return false, errors.New("access denied")
	}
	user.Password = model.EncodePassword(newPassword)
	if err := r.DB.Save(user).Error; err != nil {
		return false, fmt.Errorf("could not change password due an error: %s", err.Error())
	}
	return true, nil
}

func (r *mutationResolver) CreateAdminUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	obj := model.User{
		FirstName: strings.TrimSpace(input.FirstName),
		LastName:  strings.TrimSpace(input.LastName),
		Email:     strings.TrimSpace(input.Email),
		Password:  model.EncodePassword(input.Password),
		Role:      model.RoleAdministrator.String(),
	}
	if err := r.DB.Create(&obj).Error; err != nil {
		return nil, fmt.Errorf("could not create user due an error: %s", err.Error())
	}
	return &obj, nil
}

func (r *mutationResolver) Logout(ctx context.Context) (bool, error) {
	a := r.GetAuth(ctx)
	if a != nil {
		session := sessions.Default(a.Context)
		session.Clear()
		r.DB.Create(&model.ExpireToken{
			Token: a.Token,
		})
	}
	return true, nil
}

func (r *queryResolver) User(ctx context.Context, id int64) (*model.User, error) {
	user := model.GetUserById(id)
	user.Password = ""
	return user, nil
}

func (r *queryResolver) Viewer(ctx context.Context) (*model.Viewer, error) {
	var (
		res model.Viewer
	)
	res.User = r.GetCurrentUser(ctx)
	return &res, nil
}
