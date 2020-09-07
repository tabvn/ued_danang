package model

func (s *Student) GetClass() *Class{
	var c Class
	 DB.Where("id = ?", s.ClassID).Take(&c)
	return &c
}
