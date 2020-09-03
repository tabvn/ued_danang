package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"strings"
)

var (
	CtxKey  = "AppContext"
	signKey = []byte(env("JWT_SECRET", "hkD7lRPQSTP9VNs1ACI2y8UWaT1fa8LTS2pvnNWSRS6sQw4Wvt"))
)

type Auth struct {
	IP        string
	UserID    int64
	Token     string
	Meta      map[string]interface{}
	Context   *gin.Context
}

type Claim struct {
	UserID    int64
	SessionID string
	jwt.StandardClaims
}
func Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := GetToken(c.Request)
		auth := &Auth{
			IP:      GetIP(c.Request),
			Token:   token,
			Context: c,
		}
		if decode := DecodeJwt(token); decode != nil {
			auth.UserID = decode.UserID
		}
		ctx := context.WithValue(c.Request.Context(), CtxKey, auth)
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func GetToken(r *http.Request) string {
	t := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	if t == "Bearer" {
		return ""
	}
	return t
}

func GetIP(r *http.Request) string {
	forwarded := r.Header.Get("X-FORWARDED-FOR")
	if forwarded != "" {
		return forwarded
	}
	return r.RemoteAddr
}

func env(key, val string) string {
	v := os.Getenv(key)
	if len(v) > 0 {
		return v
	}
	return val
}

func generateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	// Note that err == nil only if we read len(b) bytes.
	if err != nil {
		return nil, err
	}
	return b, nil
}
func GenerateSessionID(s int) string {
	b, _ := generateRandomBytes(s)
	return base64.URLEncoding.EncodeToString(b)
}
func SignIn(userID int64, expiredAt int64) (string, error) {
	c := &Claim{
		UserID:    userID,
		SessionID: GenerateSessionID(32),
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiredAt,
			Issuer:    "ued",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	ss, err := token.SignedString(signKey)
	return ss, err
}

func DecodeJwt(token string) *Claim {
	if len(token) == 0 {
		return nil
	}
	t, err := jwt.ParseWithClaims(token, &Claim{}, func(token *jwt.Token) (interface{}, error) {
		return signKey, nil
	})
	if err != nil {
		return nil
	}
	if c, ok := t.Claims.(*Claim); ok && t.Valid {
		if c == nil {
			return nil
		}
		return c
	} else {
		return nil
	}
}
