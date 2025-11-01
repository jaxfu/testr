package passwords

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/user"
)

type reqCheckPasswordResetCode struct {
	Username string `json:"username"`
	Code     string `json:"code"`
}

func CheckResetCode(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// bind payload
		var payload reqCheckPasswordResetCode
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding req body: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// search db for code
		rc, err := user.GetPasswordResetCodeByCode(db, payload.Code)
		if err != nil {
			ctx.Status(http.StatusBadRequest)
			return
		}

		// get user info
		info, err := user.GetUserDataByUserID(db, rc.UserID)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			return
		}
		if !strings.EqualFold(info.Username, payload.Username) {
			fmt.Fprintf(os.Stderr, "username mismatch, wanted %s got %s\n", info.Username, payload.Username)
			ctx.Status(http.StatusBadRequest)
			return
		}

		ctx.JSON(http.StatusOK, info)
	}
}
