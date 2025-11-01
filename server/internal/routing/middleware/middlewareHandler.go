package middleware

import "mathtestr.com/server/internal/routing/consts"

type MiddlewareHandler struct {
	JWTValidatedRoutes map[string]struct{}
}

func NewMiddlewareHandler() *MiddlewareHandler {
	MiddlewareHandler := MiddlewareHandler{
		JWTValidatedRoutes: map[string]struct{}{
			consts.RouteUrlUser:                  {},
			consts.RouteUrlGameSessions:          {},
			consts.RouteUrlVertical:              {},
			consts.RouteUrlClasses:               {},
			consts.RouteUrlAssignment:            {},
			consts.RouteUrlGetAssignmentsTeacher: {},
			consts.RouteUrlStudent:               {},
			consts.RouteUrlPasswordResetCode:     {},
			consts.RouteUrlGetTeacherData:        {},
		},
	}

	return &MiddlewareHandler
}
