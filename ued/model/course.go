package model

func (c *Course) GetRegisterCount() int {
	var count int64
	DB.Model(&CourseStudent{}).Where("course_id = ?", c.ID).Count(&count)
	return int(count)
}
