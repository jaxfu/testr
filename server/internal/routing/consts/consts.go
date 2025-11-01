package consts

const (
	CtxKeyUserid                          string = "user_id"
	BearerTokenPrefix                     string = "Bearer "
	HeaderTypeAuthorization               string = "Authorization"
	RouteUrlBase                          string = "/api"
	RouteUrlLogin                         string = RouteUrlBase + "/login"
	RouteUrlUser                          string = RouteUrlBase + "/user"
	RouteUrlGameSessions                  string = RouteUrlBase + "/user/gamesessions"
	RouteUrlVertical                      string = RouteUrlBase + "/user/vertical"
	RouteUrlClasses                       string = RouteUrlBase + "/classes"
	RouteUrlRegisterTeacher               string = RouteUrlBase + "/register/teacher"
	RouteUrlRegisterStudent               string = RouteUrlBase + "/register/student"
	RouteUrlCheckUsername                 string = RouteUrlBase + "/register/checkUsername/:username"
	RouteUrlGetTeacherInfoForRegisterPage string = RouteUrlBase + "/teacher/get/:id"
	RouteUrlGetTeacherData                string = RouteUrlBase + "/teacher/get"
	RouteUrlAssignment                    string = RouteUrlBase + "/assignments"
	RouteUrlGetAssignmentsTeacher         string = RouteUrlBase + "/assignments/get/teacher"
	RouteUrlStudent                       string = RouteUrlBase + "/teacher/student/:id"
	RouteUrlPasswordResetCode             string = RouteUrlBase + "/password/reset/:id"
	RouteUrlPasswordResetCodeCheck        string = RouteUrlBase + "/password/reset/code"
	RouteUrlPassword                      string = RouteUrlBase + "/password"
)
