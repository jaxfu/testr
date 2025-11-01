package main

import (
	"fmt"
	"log"
	"os"

	"mathtestr.com/server/internal/routing/routes/assignments"
	"mathtestr.com/server/internal/routing/routes/gamesessions"
	"mathtestr.com/server/internal/routing/routes/login"
	"mathtestr.com/server/internal/routing/routes/register"
	"mathtestr.com/server/internal/routing/routes/students"
	"mathtestr.com/server/internal/routing/routes/teachers"
	teacher_assignments "mathtestr.com/server/internal/routing/routes/teachers/assignments"
	"mathtestr.com/server/internal/routing/routes/teachers/classes"
	"mathtestr.com/server/internal/routing/routes/users"
	"mathtestr.com/server/internal/routing/routes/users/passwords"
	"mathtestr.com/server/internal/routing/routes/users/vertical"

	"mathtestr.com/server/internal/dbHandler"

	"github.com/gin-contrib/cors"
	"github.com/mandrigin/gin-spa/spa"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"mathtestr.com/server/internal/routing/consts"
	"mathtestr.com/server/internal/routing/middleware"
)

func main() {
	// ENV CONFIG
	if os.Getenv("MODE") != "PROD" {
		if err := godotenv.Load(".env"); err != nil {
			fmt.Printf("%+v\n", err)
			os.Exit(1)
		}
	}
	PORT := os.Getenv("PORT")
	if PORT == "" {
		fmt.Println("No env variable PORT")
		os.Exit(1)
	}

	// Test backup
	// cmd := exec.Command("./backup.sh")
	// if err := cmd.Run(); err != nil {
	// 	log.Printf("Error backing up Postgres: %+v\n", err)
	// }

	// Conn
	db, err := dbHandler.InitDBHandler(os.Getenv("DB_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "error initializing db conn: %+v\n", err)
		os.Exit(1)
	}
	defer db.Conn.Close()

	// ROUTING
	router := gin.Default()
	if os.Getenv("MODE") == "DEV" {
		fmt.Println("**DEV MODE DETECTED, ENABLING CORS**")
		config := cors.DefaultConfig()
		config.AllowOrigins = []string{"http://localhost:5000", "http://localhost:5173"}
		config.AllowCredentials = true
		config.AllowMethods = []string{"POST", "GET", "PUT", "DELETE"}
		config.AllowHeaders = []string{consts.HeaderTypeAuthorization, "Content-Type"}
		router.Use(cors.New(config))
	}

	// init middleware handler
	middleware := middleware.NewMiddlewareHandler()
	router.Use(middleware.ValidateAccessToken())

	if err := router.SetTrustedProxies([]string{"127.0.0.1"}); err != nil {
		fmt.Fprintf(os.Stderr, "error setting up trusted proxies: %+v\n", err)
		os.Exit(1)
	}

	router.POST(consts.RouteUrlLogin, login.Login(db))
	router.POST(consts.RouteUrlGameSessions, gamesessions.Add(db))
	router.POST(consts.RouteUrlClasses, classes.Add(db))
	router.POST(consts.RouteUrlRegisterTeacher, register.RegisterTeacher(db))
	router.POST(consts.RouteUrlRegisterStudent, register.RegisterStudent(db))
	router.POST(consts.RouteUrlAssignment, assignments.Add(db))
	router.POST(consts.RouteUrlPasswordResetCodeCheck, passwords.CheckResetCode(db))

	router.GET(consts.RouteUrlUser, users.Get(db))
	router.GET(consts.RouteUrlGetTeacherData, teachers.Get(db))
	router.GET(consts.RouteUrlGameSessions, gamesessions.Get(db))
	router.GET(consts.RouteUrlCheckUsername, register.CheckUsername(db))
	router.GET(consts.RouteUrlGetTeacherInfoForRegisterPage, register.GetTeacherInfoForRegisterPage(db))
	router.GET(consts.RouteUrlGetAssignmentsTeacher, teacher_assignments.Get(db))
	router.GET(consts.RouteUrlPasswordResetCode, passwords.Get(db))
	router.GET(consts.RouteUrlStudent, students.Get(db))

	router.PUT(consts.RouteUrlPassword, passwords.Update(db))
	router.PUT(consts.RouteUrlStudent, students.Update(db))
	router.PUT(consts.RouteUrlVertical, vertical.Update(db))

	router.DELETE(consts.RouteUrlStudent, students.Delete(db))

	router.Use(spa.Middleware("/", "client"))

	log.Panic(router.Run(PORT))
}
