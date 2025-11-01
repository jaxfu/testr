package register

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/teacher"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/types"
)

type resGetTeacherInfo struct {
	FirstName string               `json:"first_name"`
	LastName  string               `json:"last_name"`
	School    string               `json:"school"`
	Classes   []types.TeacherClass `json:"classes"`
	Valid     bool                 `json:"valid"`
}

func GetTeacherInfoForRegisterPage(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		res := resGetTeacherInfo{
			Valid: false,
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
		userID := types.UserID(userParamID32)

		// get user data
		userData, err := user.GetUserDataByUserID(db, userID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				fmt.Fprintf(os.Stderr, "could not find user by id %d: %+v\n", userID, err)
				ctx.JSON(http.StatusOK, res)
				return
			}
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}

		// get teacher data
		teacherData, err := teacher.GetTeacherDataByUserID(db, userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetTeacherDataByUserID: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}

		// get classes
		classes, err := teacher.GetTeacherClassesByUserID(db, userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetTeacherClassesByUserID: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}

		res = resGetTeacherInfo{
			FirstName: userData.FirstName,
			LastName:  userData.LastName,
			School:    teacherData.School,
			Classes:   classes,
			Valid:     true,
		}
		ctx.JSON(http.StatusOK, res)
	}
}
