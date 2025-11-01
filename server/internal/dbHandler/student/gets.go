package student

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

const QGetStudentDataByUserID = `
	SELECT user_id, teacher_id, class_id
	FROM students.data
	WHERE user_id=$1
`

func GetStudentDataByUserID(db *dbHandler.DBHandler, UserID types.UserID) (types.StudentData, error) {
	var StudentData types.StudentData
	err := db.Conn.QueryRow(
		context.Background(),
		QGetStudentDataByUserID,
		UserID,
	).Scan(
		&StudentData.UserID,
		&StudentData.TeacherID,
		&StudentData.ClassID,
	)
	if err != nil {
		return StudentData, err
	}
	return StudentData, nil
}

const QGetAllStudentsDataByTeacherID = `
	SELECT user_id, teacher_id, class_id, first_name, last_name, username
	FROM students.data
	NATURAL JOIN users.data
	WHERE teacher_id=$1
	ORDER BY class_id
`

func GetAllStudentsDataByTeacherID(db *dbHandler.DBHandler, UserID types.UserID) ([]types.StudentData, error) {
	students := []types.StudentData{}

	rows, err := db.Conn.Query(
		context.Background(),
		QGetAllStudentsDataByTeacherID,
		UserID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var student types.StudentData

		err := rows.Scan(
			&student.UserID,
			&student.TeacherID,
			&student.ClassID,
			&student.FirstName,
			&student.LastName,
			&student.Username,
		)
		if err != nil {
			return nil, err
		}
		students = append(students, student)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return students, nil
}

const QGetStudentsDataByClassID = `
	SELECT user_id, teacher_id, class_id, first_name, last_name, username
	FROM students.data
	NATURAL JOIN users.data
	WHERE class_id=$1
	ORDER BY LOWER(last_name)
`

func GetStudentsDataByClassID(db *dbHandler.DBHandler, classID uint) ([]types.StudentData, error) {
	students := []types.StudentData{}

	rows, err := db.Conn.Query(
		context.Background(),
		QGetStudentsDataByClassID,
		classID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var student types.StudentData

		err := rows.Scan(
			&student.UserID,
			&student.TeacherID,
			&student.ClassID,
			&student.FirstName,
			&student.LastName,
			&student.Username,
		)
		if err != nil {
			return nil, err
		}
		students = append(students, student)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return students, nil
}
