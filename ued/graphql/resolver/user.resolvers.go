package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/tabvn/ued/auth"
	"github.com/tabvn/ued/model"
	"github.com/tabvn/ued/validate"
)

func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	if !validate.Email(input.Email) {
		return nil, errors.New("invalid email address")
	}
	if len(input.Password) < 5 {
		return nil, errors.New("invalid password")
	}
	obj := model.User{
		Email:    input.Email,
		Password: model.EncodePassword(input.Password),
	}
	if err := r.DB.Create(&obj).Error; err != nil {
		return nil, fmt.Errorf("create user error %s", err.Error())
	}
	obj.Password = ""
	return &obj, nil
}

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
