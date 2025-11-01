package students

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/gamesession"
	"mathtestr.com/server/internal/dbHandler/student"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
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

		// get user data
		userData, err := user.GetUserDataByUserID(db, userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, nil)
			return
		}

		// check role
		if userData.Role == "S" {
			ctx.Status(http.StatusUnauthorized)
		}

		// get param
		paramStr := ctx.Param("id")

		// Convert the string to a uint
		userParamID32, err := strconv.ParseUint(paramStr, 10, 32)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error parsing param string: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}
		userParamID := types.UserID(userParamID32)

		// get student data
		studentUserData, err := user.GetUserDataByUserID(db, userParamID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// check if student
		if studentUserData.Role != "S" {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// check if student owned by teacher
		studentData, err := student.GetStudentDataByUserID(db, userParamID)
		if studentData.TeacherID != userID {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// get sessions
		sessions, err := gamesession.GetAllGameSessionsByUserID(db, studentData.UserID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetGameSessionsByUserID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		ctx.JSON(http.StatusOK, sessions)
	}
}
