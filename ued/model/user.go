package model

import (
	"golang.org/x/crypto/bcrypt"
)

func EncodePassword(password string) string {
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return ""
	}
	return string(hashPassword)
}

func GetUserById(id int64) *User {
	var obj User
	if err := DB.Where("id =?", id).Take(&obj).Error; err != nil {
		return nil
	}
	return &obj
}
func ComparePassword(password, hash string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return false
	}
	return true
}
