package model

import (
	"encoding/json"
	"log"
)

func (c *Course) GetRegisterCount() int {
	var count int64
	DB.Model(&CourseStudent{}).Where("course_id = ?", c.ID).Count(&count)
	return int(count)
}

//[{"name": "score1", "value": 0.1, "status": true}, {"name": "score2", "value": 0.2, "status": false}, {"name": "score3", "value": 0.4, "status": true}, {"name": "score4", "value": 0.5, "status": true}]
func (c *Course) GetScoreConfigure() []*ScoreConfigureItem {
	var res []*ScoreConfigureItem
	initValues := []*ScoreConfigureItem{
		{
			Name:   "score1",
			Value:  0.2,
			Status: true,
		},
		{
			Name:   "score2",
			Value:  0.2,
			Status: false,
		},
		{
			Name:   "score3",
			Value:  0.3,
			Status: true,
		},
		{
			Name:   "score4",
			Value:  0.5,
			Status: true,
		},
	}
	if c.ScoreConfigure == nil {
		return initValues
	}
	if err := json.Unmarshal(c.ScoreConfigure, &res); err != nil {
		return initValues
	}
	if res == nil {
		return initValues
	}
	if len(res) == 0 {
		return initValues
	}
	return res
}

func (c *Course) GetTotalScore(s1, s2, s3, s4 *float64) *float64 {
	var s *float64
	config := c.GetScoreConfigure()
	m := map[string]*float64{
		"score1": s1,
		"score2": s2,
		"score3": s3,
		"score4": s4,
	}
	for _, cf := range config {
		if cf.Status {
			if score, ok := m[cf.Name]; ok {
				if score != nil {
					if s == nil {
						s = new(float64)
					}
					*s += *score * cf.Value
				}
			}
		}
	}
	return s
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
