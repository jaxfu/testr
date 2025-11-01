package user

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// DELETES

const EDeleteUserByUserID = `
	DELETE FROM users.ids
	WHERE user_id=$1
`

func DeleteUserByUserID(db *dbHandler.DBHandler, id types.UserID) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EDeleteUserByUserID,
		id,
	)
	if err != nil {
		return err
	}
	return nil
}

const EDeletePasswordResetCodeByUserID = `
	DELETE FROM users.password_reset_codes
	WHERE user_id=$1
`

func DeletePasswordResetCodeByUserID(db *dbHandler.DBHandler, id types.UserID) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EDeletePasswordResetCodeByUserID,
		id,
	)
	if err != nil {
		return err
	}
	return nil
}
