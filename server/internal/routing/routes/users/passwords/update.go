package passwords

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"mathtestr.com/server/internal/auth"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

type updatePasswordReq struct {
	Code     string `json:"code"`
	Password string `json:"password"`
}

func Update(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// bind payload
		var payload updatePasswordReq
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding request body %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// search db for code
		rc, err := user.GetPasswordResetCodeByCode(db, payload.Code)
		if err != nil {
			ctx.Status(http.StatusBadRequest)
			return
		}

		// salt and hash password
		salt, err := utils.GenerateSalt(16)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Printf("error generating salt: %+v\n", err)
			return
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(payload.Password+salt), bcrypt.DefaultCost)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Printf("error hashing password: %+v\n", err)
			return
		}

		// update password
		if err := user.UpdatePasswordAndSaltByUserID(db, rc.UserID, string(hashed), salt); err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Printf("error in UpdatePasswordAndSaltByUserID: %+v\n", err)
			return
		}

		// generate JWT
		accessToken, err := auth.CreateJWTFromUserID(rc.UserID, 7)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			return
		}
		tokens := types.AllTokens{
			AccessToken:  accessToken,
			RefreshToken: accessToken,
		}

		// delete password reset code
		if err := user.DeletePasswordResetCodeByUserID(db, rc.UserID); err != nil {
			ctx.Status(http.StatusInternalServerError)
			return
		}

		ctx.JSON(http.StatusCreated, tokens)
	}
}
