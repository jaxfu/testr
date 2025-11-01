package gamesession

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// GETS

const QGetGameSessionByGameSessionID = `
  SELECT game_session_id, user_id, timestamp, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div 
  FROM game_sessions.data
	NATURAL JOIN game_sessions.settings
  WHERE game_session_id=$1
`

func GetGameSessionByGameSessionID(db *dbHandler.DBHandler, gameSessionID uuid.UUID) (types.GameSession, error) {
	var gameSession types.GameSession

	err := db.Conn.QueryRow(
		context.Background(),
		QGetGameSessionByGameSessionID,
		gameSessionID,
	).Scan(
		&gameSession.GameSessionID,
		&gameSession.UserID,
		&gameSession.Timestamp,
		&gameSession.LimitType,
		&gameSession.QuestionsCount,
		&gameSession.CorrectCount,
		&gameSession.Score,
		&gameSession.Time,
		&gameSession.Min,
		&gameSession.Max,
		&gameSession.Add,
		&gameSession.Sub,
		&gameSession.Mult,
		&gameSession.Div,
	)
	if err != nil {
		return gameSession, err
	}

	return gameSession, nil
}

const QGetAllGameSessionByUserID = `
  SELECT game_session_id, user_id, timestamp, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div 
  FROM game_sessions.data
	NATURAL JOIN game_sessions.settings
  WHERE user_id=$1
	ORDER BY timestamp DESC
`

func GetAllGameSessionsByUserID(db *dbHandler.DBHandler, id types.UserID) ([]types.GameSession, error) {
	sessions := []types.GameSession{}

	rows, err := db.Conn.Query(
		context.Background(),
		QGetAllGameSessionByUserID,
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var session types.GameSession

		err = rows.Scan(
			&session.GameSessionID,
			&session.UserID,
			&session.Timestamp,
			&session.LimitType,
			&session.QuestionsCount,
			&session.CorrectCount,
			&session.Score,
			&session.Time,
			&session.Min,
			&session.Max,
			&session.Add,
			&session.Sub,
			&session.Mult,
			&session.Div,
		)
		if err != nil {
			return nil, err
		}

		sessions = append(sessions, session)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sessions, nil
}

const QGetMatchingSettings = `
	SELECT settings_id
	FROM game_sessions.settings
	WHERE limit_type=$1
	AND limit_amount=$2
	AND min=$3
	AND max=$4
	AND add=$5
	AND sub = $6
  AND mult = $7
  AND div = $8
`

func CheckForExistingSettings(db *dbHandler.DBHandler, settings types.DBGameSessionSettings) (bool, uuid.UUID, error) {
	var id uuid.UUID

	err := db.Conn.QueryRow(
		context.Background(),
		QGetMatchingSettings,
		settings.LimitType,
		settings.LimitAmount,
		settings.Min,
		settings.Max,
		settings.Add,
		settings.Sub,
		settings.Mult,
		settings.Div,
	).Scan(&id)
	if err != nil {
		if err == pgx.ErrNoRows {
			return false, id, nil
		}
		return false, id, err
	}

	return true, id, nil
}
