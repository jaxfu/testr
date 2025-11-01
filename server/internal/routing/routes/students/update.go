package students

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/student"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

type updateStudentReq struct {
	FirstName string       `json:"first_name"`
	LastName  string       `json:"last_name"`
	Username  string       `json:"username"`
	UserID    types.UserID `json:"user_id"`
	ClassID   uint         `json:"class_id"`
}

func Update(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, nil)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// get userData
		userData, err := user.GetUserDataByUserID(db, userID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, nil)
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID: %+v\n", err)
			return
		}

		// validate role
		if userData.Role != "T" {
			ctx.JSON(http.StatusUnauthorized, nil)
			return
		}

		// bind payload
		var payload updateStudentReq
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding request body %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// get student data
		studentData, err := student.GetStudentDataByUserID(db, payload.UserID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetStudentDataByUserID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// check if student is owned by teacher making request
		if studentData.TeacherID != userID {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// update student userData
		d := types.UserData{
			FirstName: payload.FirstName,
			LastName:  payload.LastName,
			Username:  payload.Username,
			UserID:    payload.UserID,
		}
		if err := user.UpdateUserData(db, d); err != nil {
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// update student class_id
		if err := student.UpdateStudentClassIDByUserID(db, payload.UserID, payload.ClassID); err != nil {
			ctx.Status(http.StatusInternalServerError)
			return
		}

		ctx.Status(http.StatusAccepted)
	}
}
