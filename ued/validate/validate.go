package validate

import (
	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

func Email(s string) bool {
	if err := validate.Var(s, "required,email"); err != nil {
		return false
	}
	return true
}
func Required(s string) bool {
	if err := validate.Var(s, "required"); err != nil {
		return false
	}
	return true
}
