package gamesessions

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/gamesession"
	"mathtestr.com/server/internal/routing/utils"
)

func Get(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, nil)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// get game sessions
		sessions, err := gamesession.GetAllGameSessionsByUserID(db, userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error getting gameSessions %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, nil)
			return
		}

		ctx.JSON(http.StatusOK, sessions)
	}
}
