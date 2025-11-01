package register

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/user"
)

type resCheckUsername struct {
	Valid bool `json:"valid"`
}

func CheckUsername(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		res := resCheckUsername{Valid: false}

		username := ctx.Param("username")

		// check for username
		_, err := user.GetUserIDByUsername(db, username)
		if err != nil {
			if !errors.Is(err, pgx.ErrNoRows) {
				fmt.Printf("Error checking username validity: %+v\n", err)
				ctx.JSON(http.StatusInternalServerError, res)
				return
			}
		} else {
			fmt.Printf("Username '%s' already exists\n", username)
			ctx.JSON(http.StatusOK, res)
			return
		}

		res.Valid = true
		ctx.JSON(http.StatusOK, res)
	}
}
