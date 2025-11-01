package passwords

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
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

		// check for existing codes
		code, err := user.GetPasswordResetCodeByUserID(db, userParamID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetPasswordResetCodeByUserID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// if code exists
		if code != "" {
			rc := types.PasswordResetCode{
				UserID: userParamID,
				Code:   code,
			}
			ctx.JSON(http.StatusOK, rc)
			return
		}

		// generate code
		code, err = generateRandomCode(4)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in generateRandomCode: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// store code
		rc := types.PasswordResetCode{
			UserID: userParamID,
			Code:   code,
		}
		if err := user.InsertPasswordResetCode(db, rc); err != nil {
			fmt.Fprintf(os.Stderr, "error in InsertPasswordResetCode: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("success, sending %+v\n", rc)

		ctx.JSON(http.StatusOK, rc)
	}
}

func generateRandomCode(length int) (string, error) {
	const charset = "abcdefghijklmnopqrstuvwxyz0123456789"
	code := make([]byte, length)
	for i := range code {
		// Select a random index from charset
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		code[i] = charset[num.Int64()]
	}
	return string(code), nil
}
