// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"
)

var DB *gorm.DB
var StdChars = []byte("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")

func AutoMigrate(db *gorm.DB) {
	DB = db
	db.AutoMigrate(

		&Class{},
		&Course{},
		&CourseStudent{},
		&ExpireToken{},
		&Faculty{},
		&File{},
		&Logger{},
		&Student{},
		&Teacher{},
		&User{},
	)
}

type Model interface {
	IsModel()
}

type Class struct {
	ID        int64          `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name" gorm:"uniqueIndex"`
	FacultyID int64          `json:"facultyId" gorm:"index"`
	Faculty   *Faculty       `json:"faculty" gorm:"foreignKey:FacultyID"`
	Year      int            `json:"year"`
	TeacherID int64          `json:"teacherId" gorm:"index"`
	Teacher   *Teacher       `json:"teacher" gorm:"foreignKey:TeacherID"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeleteAt  gorm.DeletedAt `gorm:"index"`
}

func (Class) IsModel() {}

type ClassConnection struct {
	Total int64    `json:"total"`
	Nodes []*Class `json:"nodes"`
}

type ClassFilter struct {
	Search    *string `json:"search"`
	TeacherID *int64  `json:"teacherId"`
	Limit     *int    `json:"limit"`
	Offset    *int    `json:"offset"`
}

type ClassInput struct {
	Name      string `json:"name"`
	FacultyID int64  `json:"facultyId"`
	TeacherID int64  `json:"teacherId"`
	Year      int    `json:"year"`
}

type Course struct {
	ID            int64          `json:"id" gorm:"primaryKey"`
	Code          string         `json:"code"`
	Required      bool           `json:"required"`
	Limit         int            `json:"limit"`
	TeacherID     int64          `json:"teacherId"`
	Teacher       *Teacher       `json:"teacher"`
	Faculties     []*Faculty     `json:"faculties" gorm:"many2many:course_faculty"`
	Title         string         `json:"title"`
	LessonDay     int            `json:"lessonDay"`
	LessonFrom    int            `json:"lessonFrom"`
	LessonTo      int            `json:"lessonTo"`
	Unit          int            `json:"unit"`
	Open          bool           `json:"open" gorm:"default:true"`
	RegisterCount int            `json:"registerCount" gorm:"-"`
	IsRegistered  bool           `json:"isRegistered" gorm:"-"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	CreatedAt     time.Time      `json:"createdAt"`
	DeleteAt      gorm.DeletedAt `gorm:"index"`
}

func (Course) IsModel() {}

type CourseConnection struct {
	Total int64     `json:"total"`
	Nodes []*Course `json:"nodes"`
}

type CourseFilter struct {
	Search *string `json:"search"`
	Limit  *int    `json:"limit"`
	Offset *int    `json:"offset"`
}

type CourseInput struct {
	Code       string  `json:"code"`
	Required   bool    `json:"required"`
	TeacherID  int64   `json:"teacherId"`
	Faculties  []int64 `json:"faculties"`
	Title      string  `json:"title"`
	LessonDay  int     `json:"lessonDay"`
	LessonFrom int     `json:"lessonFrom"`
	LessonTo   int     `json:"lessonTo"`
	Limit      int     `json:"limit"`
	Unit       int     `json:"unit"`
	Open       bool    `json:"open"`
}

type CourseStudent struct {
	ID          int64          `json:"id" gorm:"primaryKey"`
	StudentID   int64          `json:"studentId"`
	Student     *Student       `json:"student" gorm:"foreignKey:StudentID"`
	CourseID    int64          `json:"courseId"`
	Course      *Course        `json:"course" gorm:"foreignKey:CourseID"`
	TeacherNote *string        `json:"teacherNote"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeleteAt    gorm.DeletedAt `gorm:"index"`
}

func (CourseStudent) IsModel() {}

type CourseStudentFilter struct {
	Search *string `json:"search"`
	Limit  *int    `json:"limit"`
	Offset *int    `json:"offset"`
}

type ExpireToken struct {
	ID        int64          `json:"id" gorm:"primaryKey"`
	Token     string         `json:"token" gorm:"uniqueIndex"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeleteAt  gorm.DeletedAt `gorm:"index"`
}

func (ExpireToken) IsModel() {}

type Faculty struct {
	ID        int64          `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name" gorm:"uniqueIndex"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeleteAt  gorm.DeletedAt `gorm:"index"`
}

func (Faculty) IsModel() {}

type FacultyInput struct {
	Name string `json:"name"`
}

type File struct {
	ID        int64          `json:"id" gorm:"primaryKey"`
	StoreID   *int64         `json:"storeId" gorm:"index"`
	Name      string         `json:"name" gorm:"index"`
	Key       string         `json:"key" gorm:"uniqueIndex"`
	Thumbnail *string        `json:"thumbnail"`
	Cloud     string         `json:"cloud"`
	Size      int64          `json:"size"`
	Mime      string         `json:"mime"`
	Width     *int           `json:"width"`
	Height    *int           `json:"height"`
	URL       *string        `json:"url"`
	Source    *string        `json:"source"`
	Kind      string         `json:"kind"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeleteAt  gorm.DeletedAt `gorm:"index"`
}

func (File) IsModel() {}

type Logger struct {
	ID        int64          `json:"id" gorm:"primaryKey"`
	Type      string         `json:"type"`
	Message   datatypes.JSON `json:"message"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeleteAt  gorm.DeletedAt `gorm:"index"`
}

func (Logger) IsModel() {}

type LoggerConnection struct {
	Nodes []*Logger `json:"nodes"`
	Total int64     `json:"total"`
}

type LoggerFilter struct {
	Search *string `json:"search"`
	Limit  *int    `json:"limit"`
	Offset *int    `json:"offset"`
}

type NewUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Sort struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type Student struct {
	ID        int64          `json:"id" gorm:"primaryKey"`
	UserID    int64          `json:"userId" gorm:"index"`
	User      *User          `json:"user" gorm:"foreignKey:UserID"`
	Code      string         `json:"code" gorm:"uniqueIndex"`
	ClassID   int64          `json:"classId"`
	Class     *Class         `json:"class" gorm:"foreignKey:ClassID"`
	FirstName string         `json:"firstName"`
	LastName  string         `json:"lastName"`
	Gender    int            `json:"gender"`
	Birthday  time.Time      `json:"birthday"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeleteAt  gorm.DeletedAt `gorm:"index"`
}

func (Student) IsModel() {}

type StudentConnection struct {
	Total int64      `json:"total"`
	Nodes []*Student `json:"nodes"`
}

type StudentFilter struct {
	Search  *string `json:"search"`
	ClassID *int64  `json:"classId"`
	Limit   *int    `json:"limit"`
	Offset  *int    `json:"offset"`
}

type StudentInput struct {
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	Code      string    `json:"code"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Gender    int       `json:"gender"`
	Birthday  time.Time `json:"birthday"`
	ClassID   int64     `json:"classId"`
}

type Teacher struct {
	ID        int64          `json:"id" gorm:"primaryKey"`
	UserID    int64          `json:"userId" gorm:"index"`
	User      *User          `json:"user" gorm:"foreignKey:UserID"`
	FirstName string         `json:"firstName"`
	LastName  string         `json:"lastName"`
	Phone     string         `json:"phone"`
	WorkPlace *string        `json:"workPlace"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeleteAt  gorm.DeletedAt `gorm:"index"`
}

func (Teacher) IsModel() {}

type TeacherConnection struct {
	Total int64      `json:"total"`
	Nodes []*Teacher `json:"nodes"`
}

type TeacherFilter struct {
	Search *string `json:"search"`
	Limit  *int    `json:"limit"`
	Offset *int    `json:"offset"`
}

type TeacherInput struct {
	Email     string  `json:"email"`
	Password  string  `json:"password"`
	FirstName string  `json:"firstName"`
	LastName  string  `json:"lastName"`
	Phone     string  `json:"phone"`
	WorkPlace *string `json:"workPlace"`
}

type Token struct {
	ID        string    `json:"id"`
	ExpiredAt time.Time `json:"expiredAt"`
	User      *User     `json:"user"`
}

type UpdateClassInput struct {
	Name      *string `json:"name"`
	FacultyID *int64  `json:"facultyId"`
	TeacherID *int64  `json:"teacherId"`
	Year      *int    `json:"year"`
}

type UpdateCourseInput struct {
	Code       *string `json:"code"`
	Required   *bool   `json:"required"`
	TeacherID  *int64  `json:"teacherId"`
	Faculties  []int64 `json:"faculties"`
	Title      *string `json:"title"`
	LessonDay  *int    `json:"lessonDay"`
	LessonFrom *int    `json:"lessonFrom"`
	LessonTo   *int    `json:"lessonTo"`
	Limit      *int    `json:"limit"`
	Unit       *int    `json:"unit"`
	Open       *bool   `json:"open"`
}

type UpdateStudentInput struct {
	Email     *string    `json:"email"`
	Code      *string    `json:"code"`
	FirstName *string    `json:"firstName"`
	LastName  *string    `json:"lastName"`
	Password  *string    `json:"password"`
	Gender    *int       `json:"gender"`
	Birthday  *time.Time `json:"birthday"`
	ClassID   *int64     `json:"classId"`
}

type UpdateTeacherInput struct {
	Email     string  `json:"email"`
	FirstName string  `json:"firstName"`
	LastName  string  `json:"lastName"`
	Phone     string  `json:"phone"`
	WorkPlace *string `json:"workPlace"`
}

type User struct {
	ID        int64          `json:"id" gorm:"primaryKey"`
	FirstName string         `json:"firstName"`
	LastName  string         `json:"lastName"`
	Email     string         `json:"email" gorm:"uniqueIndex"`
	Password  string         `json:"password"`
	Role      string         `json:"role"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeleteAt  gorm.DeletedAt `gorm:"index"`
}

func (User) IsModel() {}

type Viewer struct {
	User    *User    `json:"user"`
	Teacher *Teacher `json:"teacher"`
	Student *Student `json:"student"`
}

type Role string

const (
	RoleAdministrator Role = "Administrator"
	RoleTeacher       Role = "Teacher"
	RoleStudent       Role = "Student"
)

var AllRole = []Role{
	RoleAdministrator,
	RoleTeacher,
	RoleStudent,
}

func (e Role) IsValid() bool {
	switch e {
	case RoleAdministrator, RoleTeacher, RoleStudent:
		return true
	}
	return false
}

func (e Role) String() string {
	return string(e)
}

func (e *Role) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Role(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Role", str)
	}
	return nil
}

func (e Role) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
