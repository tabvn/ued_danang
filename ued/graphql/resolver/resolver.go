package resolver

import (
	"context"
	"errors"
	"fmt"
	"github.com/tabvn/ued/auth"
	"github.com/tabvn/ued/model"
	"github.com/tabvn/ued/validate"
	"gorm.io/gorm"
)

type Resolver struct {
	DB *gorm.DB
}

func (r *Resolver) GetAuth(ctx context.Context) *auth.Auth {
	a := ctx.Value(auth.CtxKey)
	if a == nil {
		return nil
	}
	ac, ok := a.(*auth.Auth)
	if !ok {
		return nil
	}
	if len(ac.Token) > 0 {
		var result = struct {
			Count int
		}{
			Count: 0,
		}
		if err := r.DB.Raw("SElECT COUNT(id) as count FROM expire_tokens WHERE token = ?", ac.Token).Scan(&result).Error; err != nil {
			ac.UserID = 0
		}
		if result.Count > 0 {
			ac.UserID = 0
		}
	}
	return ac
}

func (r *Resolver) GetCurrentUser(ctx context.Context) *model.User {
	a := r.GetAuth(ctx)
	if a == nil {
		return nil
	}
	var user model.User
	if err := r.DB.Where("id = ?", a.UserID).Take(&user).Error; err != nil {
		return nil
	}
	return &user
}

func (r *Resolver) GetStudentFromContext(ctx context.Context) *model.Student {
	user := r.GetCurrentUser(ctx)
	if user == nil {
		return nil
	}
	if user.Role == model.RoleStudent.String() {
		return nil
	}
	var s model.Student
	if err := r.DB.Where("user_id = ?", user.ID).Take(&s).Error; err != nil {
		return nil
	}
	return &s
}

func (r *Resolver) CreateUser(tx *gorm.DB, first, last, email, password string) (*model.User, error) {
	if !validate.Email(email) {
		return nil, errors.New("invalid email address")
	}
	if len(password) < 5 {
		return nil, errors.New("invalid password")
	}
	obj := model.User{
		FirstName: first,
		LastName:  last,
		Email:     email,
		Password:  model.EncodePassword(password),
	}
	if tx == nil {
		tx = r.DB
	}
	if err := tx.Create(&obj).Error; err != nil {
		return nil, fmt.Errorf("create user error %s", err.Error())
	}
	return &obj, nil
}
