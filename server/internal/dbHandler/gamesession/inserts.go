package gamesession

import (
	"context"

	"github.com/google/uuid"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// INSERTS
const EInsertGameSessionData = `
  INSERT INTO game_sessions.data(game_session_id, user_id, settings_id, time, score, questions_count, correct_count)
  VALUES($1, $2, $3, $4, $5, $6, $7)
`

func InsertGameSessionData(db *dbHandler.DBHandler, session types.GameSession) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EInsertGameSessionData,
		session.GameSessionID,
		session.UserID,
		session.SettingsID,
		session.Time,
		session.Score,
		session.QuestionsCount,
		session.CorrectCount,
	)
	if err != nil {
		return err
	}

	return nil
}

const EInsertGameSessionSettings = `
	INSERT INTO game_sessions.settings(settings_id, limit_type, limit_amount, min, max, add, sub, mult, div)
	VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
`

func InsertGameSessionSettings(db *dbHandler.DBHandler, settings types.DBGameSessionSettings) (uuid.UUID, error) {
	exists, id, err := CheckForExistingSettings(db, settings)
	if err != nil {
		return uuid.UUID{}, err
	}

	if !exists {
		id, err = uuid.NewRandom()
		if err != nil {
			return uuid.UUID{}, err
		}

		_, err := db.Conn.Exec(
			context.Background(),
			EInsertGameSessionSettings,
			id,
			settings.LimitType,
			settings.LimitAmount,
			settings.Min,
			settings.Max,
			settings.Add,
			settings.Sub,
			settings.Mult,
			settings.Div,
		)
		if err != nil {
			return uuid.UUID{}, err
		}

	}

	return id, nil
}

func InsertGameSession(db *dbHandler.DBHandler, session types.GameSession) error {
	id, err := InsertGameSessionSettings(db, session.DBGameSessionSettings)
	if err != nil {
		return err
	}

	session.SettingsID = id
	if err := InsertGameSessionData(db, session); err != nil {
		return err
	}

	return nil
}
