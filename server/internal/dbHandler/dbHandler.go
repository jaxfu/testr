// Package dbHandler handles communication with the Postgres database
package dbHandler

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

// DBHandler object contains a pointer to pgx connection, one per server
type DBHandler struct {
	Conn *pgxpool.Pool
}

// InitDBHandler is the constructor for DBHandler, takes a database connection
// string and returns a pointer to instantiated DBHandler.
func InitDBHandler(connectionString string) (*DBHandler, error) {
	var newDBHandler DBHandler
	db, err := pgxpool.New(context.Background(), connectionString)
	if err != nil {
		return &newDBHandler, err
	}
	newDBHandler.Conn = db

	if err := db.Ping(context.Background()); err != nil {
		return &newDBHandler, err
	}

	return &newDBHandler, nil
}

// TESTING

func (dbHandler *DBHandler) ExecuteSqlScript(filepath string) error {
	sqlFile, err := os.ReadFile(filepath)
	if err != nil {
		return err
	}

	_, err = dbHandler.Conn.Exec(context.Background(), string(sqlFile))
	if err != nil {
		return err
	}

	return nil
}
