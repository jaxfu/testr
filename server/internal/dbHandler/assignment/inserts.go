package assignment

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/gamesession"
	"mathtestr.com/server/internal/types"
)

// INSERTS
const EInsertAssignment = `
	INSERT INTO assignments.data
		(
		assignment_id,
    teacher_id,
		settings_id,
    name,
    due,
   	is_active
		)
	VALUES
		($1, $2, $3, $4, $5, $6) 
`

func InsertAssignment(db *dbHandler.DBHandler, a types.Assignment) error {
	id, err := gamesession.InsertGameSessionSettings(db, a.DBGameSessionSettings)
	if err != nil {
		return err
	}

	a.SettingsID = id
	_, err = db.Conn.Exec(
		context.Background(),
		EInsertAssignment,
		a.AssignmentID,
		a.TeacherID,
		a.SettingsID,
		a.Name,
		a.Due,
		a.IsActive,
	)
	if err != nil {
		return err
	}

	return nil
}

const EInsertAssignmentClass = `
	INSERT INTO assignments.classes (assignment_id, class_id)
	VALUES ($1, $2)
`

func InsertAssignmentClass(db *dbHandler.DBHandler, c types.DBAssignmentClass) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EInsertAssignmentClass,
		c.AssignmentID,
		c.ClassID,
	)
	if err != nil {
		return err
	}

	return nil
}
