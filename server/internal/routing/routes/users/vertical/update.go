package vertical

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/routing/utils"
)

type updateVerticalReq struct {
	Vertical bool `json:"vertical"`
}

func Update(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// bind request body
		var payload updateVerticalReq
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding json: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// update vertical
		if err := user.UpdateVerticalByUserID(db, userID, payload.Vertical); err != nil {
			fmt.Fprintf(os.Stderr, "error in UpdateVerticalByUserID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		ctx.Status(http.StatusOK)
	}
}
