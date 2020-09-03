package logger

import (
	"encoding/json"
	"fmt"
	"github.com/tabvn/ued/id"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"log"
	"time"
)

var DB *gorm.DB

func Log(logType string, msg interface{}) {
	log.Println("Logger:", logType, msg)
	var message datatypes.JSON
	if v, ok := msg.(error); ok {
		Log(logType, map[string]string{"error": v.Error()})
		return
	} else {
		b, err := json.Marshal(msg)
		if err != nil {
			log.Println(fmt.Errorf("error logging type % %s", logType, err.Error()))
		}
		message = b
	}
	now := time.Now()
	if err := DB.Exec("INSERT INTO loggers (id, type, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", id.New(), logType, message, now, now).Error; err != nil {
		log.Println("saving log err", err)
	}
}
