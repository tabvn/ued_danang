package storage

import (
	"log"
	"testing"
)

func TestName(t *testing.T) {
	_ , err := DownloadUrl("https://images.unsplash.com/photo-1525431836161-e40d6846e656?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3056&q=80", "./storage/123")
	log.Println(err)
}