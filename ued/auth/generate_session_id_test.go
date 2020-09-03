package auth

import (
	"log"
	"testing"
)

func TestRandom(t *testing.T) {
	log.Println(GenerateSessionID(32))
}