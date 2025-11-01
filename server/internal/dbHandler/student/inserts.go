package student

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

const EInsertStudentData = `
	INSERT INTO students.data(user_id, teacher_id, class_id)
	VALUES ($1, $2, $3)
`

func InsertStudentData(db *dbHandler.DBHandler, studentData types.StudentData) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EInsertStudentData,
		studentData.UserID,
		studentData.TeacherID,
		studentData.ClassID,
	)
	if err != nil {
		return err
	}
	return nil
}
