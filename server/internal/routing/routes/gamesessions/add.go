package gamesessions

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/gamesession"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

func Add(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// bind payload
		var payload types.RequestSubmitGameSession
		if err = ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding request body %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// spawn game session
		gameSessionID, err := uuid.NewRandom()
		if err != nil {
			fmt.Fprintf(os.Stderr, "error creating uuid: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		session := types.GameSession{
			GameSessionID: gameSessionID,
			UserID:        userID,
			DBGameSessionSettings: types.DBGameSessionSettings{
				LimitType: payload.LimitType,
				Min:       payload.Min,
				Max:       payload.Max,
				Add:       payload.Add,
				Sub:       payload.Sub,
				Mult:      payload.Mult,
				Div:       payload.Div,
			},
			QuestionsCount: payload.QuestionsCount,
			CorrectCount:   payload.CorrectCount,
			Score:          payload.Score,
			Time:           payload.Time,
		}
		if payload.LimitType == 0 {
			session.LimitAmount = payload.Time
		} else {
			session.LimitAmount = payload.QuestionsCount
		}
		if err = gamesession.InsertGameSession(db, session); err != nil {
			fmt.Fprintf(os.Stderr, "error inserting game session: %+v\n", err)
		}

		ctx.Status(http.StatusOK)
	}
}
