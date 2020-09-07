package model

import "log"

func (c *Course) GetRegisterCount() int {
	var count int64
	DB.Model(&CourseStudent{}).Where("course_id = ?", c.ID).Count(&count)
	return int(count)
}

func (c *Course) StudentIsRegistered(studentId int64) bool {
	var count int64
	if err := DB.Model(&CourseStudent{}).Where("student_id = ? AND course_id = ?", studentId, c.ID).Count(&count); err != nil {
		log.Println("count student is register error", err)
	}
	log.Println("cout", count)
	if count > 0 {
		return true
	}
	return false
}
