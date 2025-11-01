package teacher

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// Inserts

const EInsertTeacherData = `
	INSERT INTO teachers.data(user_id, email, school)
	VALUES ($1, $2, $3)
`

func InsertTeacherData(db *dbHandler.DBHandler, teacherData types.TeacherData) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EInsertTeacherData,
		teacherData.UserID,
		teacherData.Email,
		teacherData.School,
	)
	if err != nil {
		return err
	}
	return nil
}

const EInsertTeacherClass = `
	INSERT INTO teachers.classes(teacher_id, name)
	VALUES ($1, $2)
`

func InsertTeacherClass(db *dbHandler.DBHandler, userID types.UserID, class types.TeacherClass) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EInsertTeacherClass,
		userID,
		class.Name,
	)
	if err != nil {
		return err
	}
	return nil
}
