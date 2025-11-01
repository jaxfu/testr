package students

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

func Delete(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// get user data
		userData, err := user.GetUserDataByUserID(db, userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// check role
		if userData.Role == "S" {
			ctx.Status(http.StatusUnauthorized)
			return
		}
		// get param
		paramStr := ctx.Param("id")

		// convert the string to a uint
		userParamID32, err := strconv.ParseUint(paramStr, 10, 32)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error parsing param string: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}
		userParamID := types.UserID(userParamID32)

		// delete student
		if err := user.DeleteUserByUserID(db, userParamID); err != nil {
			fmt.Fprintf(os.Stderr, "error in DeleteUserByUserID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		ctx.Status(http.StatusOK)
	}
}
