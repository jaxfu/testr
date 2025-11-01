package user

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// INSERTS

const EInsertUser = `
	INSERT INTO users.ids DEFAULT VALUES
	RETURNING user_id
`

func InsertUser(db *dbHandler.DBHandler) (types.UserID, error) {
	var userID types.UserID
	err := db.Conn.QueryRow(context.Background(), EInsertUser).Scan(&userID)
	if err != nil {
		return userID, err
	}
	return userID, nil
}

const EInsertUserData = `
	INSERT INTO users.data (user_id, username, password, salt, first_name, last_name, role, vertical)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
`

func InsertUserData(db *dbHandler.DBHandler, userData types.UserData) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EInsertUserData,
		userData.UserID,
		userData.Username,
		userData.Password,
		userData.Salt,
		userData.FirstName,
		userData.LastName,
		userData.Role,
		userData.Vertical,
	)
	if err != nil {
		return err
	}
	return nil
}

const EInsertPasswordResetCode = `
	INSERT INTO users.password_reset_codes (user_id, code)
	VALUES ($1, $2)
`

func InsertPasswordResetCode(db *dbHandler.DBHandler, rc types.PasswordResetCode) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EInsertPasswordResetCode,
		rc.UserID,
		rc.Code,
	)
	if err != nil {
		return err
	}
	return nil
}
