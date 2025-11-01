package classes

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/teacher"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

type reqAddClass struct {
	Name string `json:"name"`
}

func Add(db *dbHandler.DBHandler) gin.HandlerFunc {
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
		var payload reqAddClass
		if err = ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding request body %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("%+v\n", payload)

		// insert classes
		class := types.TeacherClass{
			Name: payload.Name,
		}
		if err := teacher.InsertTeacherClass(db, userID, class); err != nil {
			fmt.Fprintf(os.Stderr, "error in InsertTeacherClass %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		ctx.Status(http.StatusOK)
	}
}
