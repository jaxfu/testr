package student

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// Updates
const EUpdateStudentClassIDByUserID = `
	UPDATE students.data
	SET class_id=$2
	WHERE user_id=$1
`

func UpdateStudentClassIDByUserID(db *dbHandler.DBHandler, userID types.UserID, classID uint) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EUpdateStudentClassIDByUserID,
		userID,
		classID,
	)
	if err != nil {
		return err
	}
	return nil
}
