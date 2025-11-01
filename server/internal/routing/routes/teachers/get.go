package teachers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/student"
	"mathtestr.com/server/internal/dbHandler/teacher"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

type class struct {
	types.TeacherClass
	Population uint `json:"population"`
}

type getTeacherDataRes struct {
	Classes     []class             `json:"classes"`
	Students    []types.StudentData `json:"students"`
	TeacherData types.TeacherData   `json:"teacher_data"`
}

func Get(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// get userData
		userData, err := user.GetUserDataByUserID(db, userID)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID: %+v\n", err)
			return
		}

		// validate role
		if userData.Role != "T" {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// get teacher data
		teacherData, err := teacher.GetTeacherDataByUserID(db, userID)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Fprintf(os.Stderr, "error in GetTeacherDataByUserID: %+v\n", err)
			return
		}

		// get classes
		teacherClasses, err := teacher.GetTeacherClassesByUserID(db, userID)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Fprintf(os.Stderr, "error in GetTeacherClassesByUserID: %+v\n", err)
			return
		}

		classes := []class{}
		for _, v := range teacherClasses {
			pop, err := teacher.GetTeacherClassPopulationByClassID(db, v.ClassID)
			if err != nil {
				ctx.Status(http.StatusInternalServerError)
				fmt.Fprintf(os.Stderr, "error in GetTeacherClassPopulationByUserID: %+v\n", err)
				return
			}

			class := class{
				TeacherClass: v,
				Population:   pop,
			}

			classes = append(classes, class)
		}

		// get students
		students, err := student.GetAllStudentsDataByTeacherID(db, userID)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			fmt.Fprintf(os.Stderr, "error in GetAllStudentsDataByTeacherID: %+v\n", err)
			return
		}

		res := getTeacherDataRes{
			Classes:     classes,
			Students:    students,
			TeacherData: teacherData,
		}

		ctx.JSON(http.StatusOK, res)
	}
}
