package dbHandler

import (
	"context"
	"errors"
	"fmt"
	"os"
	"testing"

	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/assignment"
	"mathtestr.com/server/internal/dbHandler/gamesession"
	"mathtestr.com/server/internal/dbHandler/student"
	"mathtestr.com/server/internal/dbHandler/teacher"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/testHelpers"

	"github.com/joho/godotenv"
)

func TestDBHandler(t *testing.T) {
	if err := godotenv.Load("../../../../config/config.env"); err != nil {
		fmt.Printf("Error loading env vars: %+v\n", err)
		os.Exit(1)
	}

	db, err := dbHandler.InitDBHandler(os.Getenv("DB_URL_TEST"))
	if err != nil {
		t.Errorf("error initializing db conn: %+v\n", err)
	}
	defer db.Conn.Close()

	testUserDataJackson := testHelpers.TestUserDataJackson
	testUserDataMichele := testHelpers.TestUserDataMichele
	testStudentData := testHelpers.TestStudentData
	testTeacherData := testHelpers.TestTeacherData
	testGameSession := testHelpers.TestGameSession
	testTeacherClass := testHelpers.TestTeacherClass
	testAssignment := testHelpers.TestAssignment
	testAssignmentClass := testHelpers.TestAssignmentClass
	testPasswordResetCode := testHelpers.TestPasswordResetCode

	t.Run("Ping connection", func(t *testing.T) {
		if err := db.Conn.Ping(context.Background()); err != nil {
			t.Errorf("Error initializing database: %+v\n", err)
		}
	})
	t.Run("DropTablesStart", func(t *testing.T) {
		if err := db.ExecuteSqlScript(os.Getenv("SQL_DROP_TABLES")); err != nil {
			t.Errorf("Error dropping tables: %+v\n", err)
		}
	})
	t.Run("CreateTables", func(t *testing.T) {
		if err := db.ExecuteSqlScript(os.Getenv("SQL_CREATE_TABLES")); err != nil {
			t.Errorf("Error initializing tables: %+v\n", err)
		}
	})

	t.Run("InsertUserIds", func(t *testing.T) {
		for range 2 {
			_, err := user.InsertUser(db)
			if err != nil {
				t.Errorf("Error in InsertUser: %+v\n", err)
			}
		}
	})

	t.Run("InsertUserDataTeacher", func(t *testing.T) {
		if err := user.InsertUserData(db, testUserDataMichele); err != nil {
			t.Errorf("Error in InsertUserData: %+v\n", err)
		}
	})
	t.Run("InsertUserDataStudent", func(t *testing.T) {
		if err := user.InsertUserData(db, testUserDataJackson); err != nil {
			t.Errorf("Error in InsertUserData: %+v\n", err)
		}
	})
	t.Run("UpdateUserData", func(t *testing.T) {
		if err := user.UpdateUserData(db, testUserDataJackson); err != nil {
			t.Errorf("Error in UpdateUserData: %+v\n", err)
		}
	})
	t.Run("GetUserDataByUserID", func(t *testing.T) {
		userData, err := user.GetUserDataByUserID(db, testUserDataJackson.UserID)
		if err != nil {
			t.Errorf("Error in GetUserDataByUserID: %+v\n", err)
		}
		if userData != testUserDataJackson {
			t.Errorf("Mismatch in GetUserDataByUserID: got %+v, want %+v", userData, testUserDataJackson)
		}
	})
	t.Run("GetUserIDByUsernameValid", func(t *testing.T) {
		userID, err := user.GetUserIDByUsername(db, testUserDataJackson.Username)
		if err != nil {
			t.Errorf("Error in GetUserIDByUsername: %+v\n", err)
		}
		if userID != testUserDataJackson.UserID {
			t.Errorf("Invalid UserID: got %d, want %d", userID, testUserDataJackson.UserID)
		}
	})
	t.Run("GetUserIDByUsernameInvalid", func(t *testing.T) {
		_, err := user.GetUserIDByUsername(db, "test")
		if !errors.Is(err, pgx.ErrNoRows) {
			t.Errorf("Expected pgx.ErrNoRows: %+v\n", err)
		}
	})

	t.Run("InsertGameSession", func(t *testing.T) {
		if err := gamesession.InsertGameSession(db, testGameSession); err != nil {
			t.Errorf("Error inserting game session: %+v", err)
		}
	})
	t.Run("GetGameSessionByGameSessionID", func(t *testing.T) {
		gameSession, err := gamesession.GetGameSessionByGameSessionID(db, testGameSession.GameSessionID)
		fmt.Printf("%+v\n", gameSession)
		if err != nil {
			t.Errorf("Error getting game session: %+v", err)
		}
		if gameSession.GameSessionID != testGameSession.GameSessionID {
			t.Errorf("Mismatch in GetGameSessionByGameID: got %+v, want %+v", gameSession.GameSessionID, testGameSession.GameSessionID)
		}
	})
	t.Run("GetGameSessionsByUserID", func(t *testing.T) {
		sessions, err := gamesession.GetAllGameSessionsByUserID(db, testGameSession.UserID)
		fmt.Printf("%+v\n", sessions)
		if err != nil {
			t.Errorf("Error in GetGameSessionsByUserID: %+v", err)
		}
	})

	t.Run("InsertTeacherData", func(t *testing.T) {
		if err := teacher.InsertTeacherData(db, testTeacherData); err != nil {
			t.Errorf("error inserting teacher data: %+v\n", err)
		}
	})
	t.Run("GetTeacherDataByUserID", func(t *testing.T) {
		data, err := teacher.GetTeacherDataByUserID(db, testTeacherData.UserID)
		if err != nil {
			t.Errorf("error getting teacher data: %+v\n", err)
		}
		if data != testTeacherData {
			t.Errorf("mismatch in GetTeacherDataByUserID: got %+v, want %+v", data, testTeacherData)
		}
	})
	t.Run("InsertTeacherClass", func(t *testing.T) {
		if err := teacher.InsertTeacherClass(db, testTeacherData.UserID, testTeacherClass); err != nil {
			t.Errorf("error in InsertTeacherClass: %+v\n", err)
		}
	})
	t.Run("GetTeacherClassesByUserID", func(t *testing.T) {
		_, err := teacher.GetTeacherClassesByUserID(db, testTeacherData.UserID)
		if err != nil {
			t.Errorf("error in GetTeacherClassesByUserID: %+v\n", err)
		}
	})

	t.Run("InsertStudentData", func(t *testing.T) {
		if err := student.InsertStudentData(db, testStudentData); err != nil {
			t.Errorf("Error inserting teacher: %+v\n", err)
		}
	})
	t.Run("GetStudentDataByUserID", func(t *testing.T) {
		data, err := student.GetStudentDataByUserID(db, testStudentData.UserID)
		if err != nil {
			t.Errorf("error getting teacher: %+v\n", err)
		}
		if data != testStudentData {
			t.Errorf("mismatch in GetTeacherDataByUserID: got %+v, want %+v", data, testTeacherData)
		}
	})
	t.Run("GetAllStudentsDataByTeacherID", func(t *testing.T) {
		if _, err := student.GetAllStudentsDataByTeacherID(db, testTeacherData.UserID); err != nil {
			t.Errorf("error in GetAllStudentsDataByTeacherID: %+v\n", err)
		}
	})

	t.Run("InsertAssignment", func(t *testing.T) {
		if err := assignment.InsertAssignment(db, testAssignment); err != nil {
			t.Errorf("error in InsertAssignment: %+v\n", err)
		}
	})
	t.Run("InsertAssignmentClasses", func(t *testing.T) {
		if err := assignment.InsertAssignmentClass(db, testAssignmentClass); err != nil {
			t.Errorf("error in InsertAssignmentClass: %+v\n", err)
		}
	})
	t.Run("GetAssignmentByAssignmentID", func(t *testing.T) {
		_, err := assignment.GetAssignmentByAssignmentID(db, testAssignment.AssignmentID)
		if err != nil {
			t.Errorf("error in GetAssignmentDataByAssignmentID: %+v\n", err)
		}
	})
	t.Run("GetAllAssignmentClassesByAssignmentID", func(t *testing.T) {
		_, err := assignment.GetAllAssignmentClassesByAssignmentID(db, testAssignment.AssignmentID)
		if err != nil {
			t.Errorf("error in GetAllAssignmentClassesByAssignmentID: %+v\n", err)
		}
	})

	t.Run("UpdateVerticalByUserID", func(t *testing.T) {
		if err := user.UpdateVerticalByUserID(db, testUserDataJackson.UserID, !testUserDataJackson.Vertical); err != nil {
			t.Errorf("error in UpdateVerticalByUserID: %+v\n", err)
		}
	})

	t.Run("InsertPasswordResetCode", func(t *testing.T) {
		if err := user.InsertPasswordResetCode(db, testPasswordResetCode); err != nil {
			t.Errorf("error in InsertPasswordResetCode: %+v\n", err)
		}
	})
	t.Run("GetPasswordResetCodeByUserID", func(t *testing.T) {
		rc, err := user.GetPasswordResetCodeByCode(db, testPasswordResetCode.Code)
		if err != nil {
			t.Errorf("error in GetPasswordResetCodeByUserID: %+v\n", err)
		}
		if rc.Code != testPasswordResetCode.Code {
			t.Errorf("mismatch in GetPasswordResetCodeByUserID: got %s, want %s\n", rc.Code, testPasswordResetCode.Code)
		}
		if rc.UserID != testUserDataJackson.UserID {
			t.Errorf("mismatch in GetPasswordResetCodeByUserID: got %d, want %d\n", rc.UserID, testUserDataJackson.UserID)
		}
	})
	t.Run("DeletePasswordResetCodeByUserID", func(t *testing.T) {
		if err := user.DeletePasswordResetCodeByUserID(db, testUserDataJackson.UserID); err != nil {
			t.Errorf("error in DeletePasswordResetCodeByUserID: %+v\n", err)
		}
	})

	t.Run("DeleteUserByUserID", func(t *testing.T) {
		if err := user.DeleteUserByUserID(db, testUserDataJackson.UserID); err != nil {
			t.Errorf("error in DeleteUserByUserID: %+v\n", err)
		}
	})

	t.Run("DropTablesEnd", func(t *testing.T) {
		if err := db.ExecuteSqlScript(os.Getenv("SQL_DROP_TABLES")); err != nil {
			t.Errorf("Error dropping tables: %+v\n", err)
		}
	})
}
