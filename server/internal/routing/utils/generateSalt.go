package utils

import (
	crypto "crypto/rand"
	"encoding/base64"
	"io"
)

func GenerateSalt(size int) (string, error) {
	salt := make([]byte, size)
	_, err := io.ReadFull(crypto.Reader, salt)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(salt), nil
}
