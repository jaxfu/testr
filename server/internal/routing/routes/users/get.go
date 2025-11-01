package users

import (
	"fmt"
	"net/http"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/user"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

func Get(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var validationResponse types.ResponseValidateSession

		// Get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Printf("error in GetJwtInfoFromCtx %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, validationResponse)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// Get UserData
		userData, err := user.GetUserDataByUserID(db, userID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, validationResponse)
			fmt.Printf("Error getting UserData during POST->login: %+v\n", err)
			return
		}

		validationResponse.Valid = true
		validationResponse.UserData = types.ResponseUserData{
			FirstName: userData.FirstName,
			LastName:  userData.LastName,
			Username:  userData.Username,
			UserID:    userID,
			Role:      userData.Role,
			Vertical:  userData.Vertical,
		}
		ctx.JSON(http.StatusOK, validationResponse)
	}
}
