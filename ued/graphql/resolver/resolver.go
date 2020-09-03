package resolver

import (
	"context"
	"github.com/tabvn/ued/auth"
	"github.com/tabvn/ued/model"
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
