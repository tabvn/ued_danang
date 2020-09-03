package id

import (
	"github.com/dchest/uniuri"
	"github.com/gosimple/slug"
)

var StdChars = []byte("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")

func Gen(l int) string {
	return uniuri.NewLenChars(l, StdChars)
}
func New() string {
	return uniuri.NewLenChars(15, StdChars)
}

func Slug(title string) string {
	return slug.Make(title)
}
