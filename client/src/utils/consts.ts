type T_LOCAL_STORAGE_KEYS = {
	access_token: string;
	refresh_token: string;
	correct_spell_info: string;
	show_info_popup: string;
};

export const LOCAL_STORAGE_KEYS: T_LOCAL_STORAGE_KEYS = {
	access_token: "ACCESS_TOKEN",
	refresh_token: "REFRESH_TOKEN",
	correct_spell_info: "CORRECT_SPELL_INFO",
	show_info_popup: "SHOW_INFO_POPUP",
};

// React-Query
export const QUERY_KEYS = {
	USER_DATA: "USER_DATA",
	TEACHER_DATA: "TEACHER_DATA",
	STUDENT_DATA: "STUDENT_DATA",
	USER_GAME_SESSIONS: "USER_GAME_SESSIONS",
	TEACHER_INFO_FOR_STUDENT_REGISTER: "TEACHER_INFO_FOR_STUDENT_REGISTER",
	PASSWORD_RESET_CODE: "PASSWORD_RESET_CODE",
};

export const USER_ROLES = {
	STUDENT: "S",
	TEACHER: "T",
	ADMIN: "A",
};

export const APP_VERSION: string = "0.7b";
