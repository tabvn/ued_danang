package util

import (
	"encoding/json"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"strings"
)

func Insert(db *gorm.DB, table string, data map[string]interface{}) *gorm.DB {
	var columns []string
	var values []interface{}
	var placeholders []string
	for k, v := range data {
		columns = append(columns, k)
		placeholders = append(placeholders, "?")
		values = append(values, v)
	}
	sql := "INSERT INTO " + table + "(" + strings.Join(columns, ", ") + ") VALUES (" + strings.Join(placeholders, ",") + ")"
	return db.Exec(sql, values...)
}

func JsonFromInterface(data interface{}) datatypes.JSON {
	if data == nil {
		return datatypes.JSON{}
	}
	b, _ := json.Marshal(data)
	return datatypes.JSON(b)
}

func GetBool(v *bool, defaultValue bool) bool {
	if v != nil {
		return *v
	}
	return defaultValue
}

func GetString(v *string, defaultValue string) string {
	if v != nil {
		return *v
	}
	return defaultValue
}
