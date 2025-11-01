package register

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
	"mathtestr.com/server/internal/auth"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/student"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

type ReqRS struct {
	Username  string       `json:"username"`
	Password  string       `json:"password"`
	FirstName string       `json:"first_name"`
	LastName  string       `json:"last_name"`
	TeacherID types.UserID `json:"teacher_id"`
	ClassID   uint         `json:"class_id"`
}

func RegisterStudent(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var payload ReqRS
		response := responseRegister{
			Result: RESULT_NULL,
		}

		// bind request body
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Printf("Error binding json: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, response)
			return
		}
		fmt.Printf("%+v\n", payload)

		// check if username currently exists
		_, err := user.GetUserIDByUsername(db, payload.Username)
		if err != nil {
			if !errors.Is(err, pgx.ErrNoRows) {
				fmt.Printf("Error checking username validity: %+v\n", err)
				ctx.JSON(http.StatusInternalServerError, response)
				return
			}
		} else {
			fmt.Printf("Username '%s' already exists", payload.Username)
			response.Result = RESULT_USERNAME_EXISTS
			ctx.JSON(http.StatusOK, response)
			return
		}

		// insert User
		userID, err := user.InsertUser(db)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("Error inserting user: %+v\n", err)
			return
		}

		// salt and hash password
		salt, err := utils.GenerateSalt(16)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("error generating salt: %+v\n", err)
			return
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(payload.Password+salt), bcrypt.DefaultCost)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("error hashing password: %+v\n", err)
			return
		}

		// create UserData
		UserData := types.UserData{
			UserID:    userID,
			Username:  payload.Username,
			Password:  string(hashed),
			Salt:      salt,
			FirstName: payload.FirstName,
			LastName:  payload.LastName,
			Role:      "S",
			Vertical:  false,
		}

		// insert UserData
		if err := user.InsertUserData(db, UserData); err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("error inserting user: %+v\n", err)
			return
		}

		// insert StudentData
		studentData := types.StudentData{
			FirstName: payload.FirstName,
			LastName:  payload.LastName,
			Username:  payload.Username,
			UserID:    userID,
			TeacherID: payload.TeacherID,
			ClassID:   payload.ClassID,
		}
		if err := student.InsertStudentData(db, studentData); err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("error inserting student: %+v\n", err)
			return
		}

		// generate JWT
		accessToken, err := auth.CreateJWTFromUserID(userID, 7)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			return
		}

		// set response
		response.Result = RESULT_VALID
		response.Tokens = types.AllTokens{
			AccessToken:  accessToken,
			RefreshToken: accessToken,
		}

		ctx.JSON(http.StatusCreated, response)

		// Backup
		//cmd := exec.Command("./backup.sh")
		//if err := cmd.Run(); err != nil {
		//	log.Printf("cError backing up Postgres: %+v\n", err)
		//}
	}
}
