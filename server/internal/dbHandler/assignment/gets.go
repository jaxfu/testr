package assignment

import (
	"context"

	"github.com/google/uuid"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// GETS
const QGetAssignmentByAssignmentID = `
SELECT
		assignment_id,
    teacher_id,
    name,
    due,
    limit_type,
    limit_amount,
    min,
    max,
    add,
    sub,
    mult,
    div,
    is_active
FROM
	assignments.data
NATURAL JOIN
	game_sessions.settings
WHERE
	assignment_id=$1
`

func GetAssignmentByAssignmentID(db *dbHandler.DBHandler, id uuid.UUID) (types.Assignment, error) {
	var a types.Assignment

	err := db.Conn.QueryRow(
		context.Background(),
		QGetAssignmentByAssignmentID,
		id,
	).Scan(
		&a.AssignmentID,
		&a.TeacherID,
		&a.Name,
		&a.Due,
		&a.LimitType,
		&a.LimitAmount,
		&a.Min,
		&a.Max,
		&a.Add,
		&a.Sub,
		&a.Mult,
		&a.Div,
		&a.IsActive,
	)
	if err != nil {
		return a, err
	}

	return a, nil
}

const QGetAllAssignmentsByTeacherID = `
SELECT
		assignment_id,
    teacher_id,
    name,
    due,
    limit_type,
    limit_amount,
    min,
    max,
    add,
    sub,
    mult,
    div,
    is_active
FROM
	assignments.data
NATURAL JOIN
	game_sessions.settings
WHERE
	teacher_id=$1
`

func GetAllAssignmentsByTeacherID(db *dbHandler.DBHandler, id types.UserID) ([]types.Assignment, error) {
	assignments := []types.Assignment{}

	rows, err := db.Conn.Query(
		context.Background(),
		QGetAllAssignmentsByTeacherID,
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var a types.Assignment

		err := rows.Scan(
			&a.AssignmentID,
			&a.TeacherID,
			&a.Name,
			&a.Due,
			&a.LimitType,
			&a.LimitAmount,
			&a.Min,
			&a.Max,
			&a.Add,
			&a.Sub,
			&a.Mult,
			&a.Div,
			&a.IsActive,
		)
		if err != nil {
			return nil, err
		}

		assignments = append(assignments, a)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return assignments, nil
}

const QGetAllAssignmentClassesByAssignmentID = `
	SELECT class_id
	FROM assignments.classes
	WHERE assignment_id=$1
`

func GetAllAssignmentClassesByAssignmentID(db *dbHandler.DBHandler, id uuid.UUID) ([]uint, error) {
	ids := []uint{}

	rows, err := db.Conn.Query(
		context.Background(),
		QGetAllAssignmentClassesByAssignmentID,
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var a uint

		err := rows.Scan(&a)
		if err != nil {
			return nil, err
		}

		ids = append(ids, a)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return ids, nil
}
