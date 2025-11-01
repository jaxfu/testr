package user

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// UPDATES

const EUpdateVerticalByUserID = `
	UPDATE users.data
	SET vertical=$2
	WHERE user_id=$1
`

func UpdateVerticalByUserID(db *dbHandler.DBHandler, id types.UserID, vertical bool) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EUpdateVerticalByUserID,
		id,
		vertical,
	)
	if err != nil {
		return err
	}
	return nil
}

const EUpdatePasswordAndSaltByUserID = `
	UPDATE users.data
	SET password=$2, salt=$3
	WHERE user_id=$1
`

func UpdatePasswordAndSaltByUserID(db *dbHandler.DBHandler, id types.UserID, password, salt string) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EUpdatePasswordAndSaltByUserID,
		id,
		password,
		salt,
	)
	if err != nil {
		return err
	}
	return nil
}

const EUpdateUserData = `
	UPDATE users.data
	SET first_name=$2, last_name=$3, username=$4
	WHERE user_id=$1
`

func UpdateUserData(db *dbHandler.DBHandler, data types.UserData) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EUpdateUserData,
		data.UserID,
		data.FirstName,
		data.LastName,
		data.Username,
	)
	if err != nil {
		return err
	}
	return nil
}
