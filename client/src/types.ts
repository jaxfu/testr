import { deepCopyObject } from "./utils/methods";

// USERDATA
export enum E_USER_ROLES {
	UNINITIALIZED = -1,
	STUDENT,
	TEACHER,
	ADMIN,
}

export type T_TOKENS = {
	access_token: string;
	refresh_token: string;
};

export const INIT_TOKENS: T_TOKENS = {
	access_token: "",
	refresh_token: "",
};

export type T_USERDATA = {
	user_id: number;
	username: string;
	first_name: string;
	last_name: string;
	role: string;
	vertical: boolean;
};

// REGISTER
export type T_USERINPUT_REGISTER = {
	username: string;
	password: string;
	confirm_password: string;
	first_name: string;
	last_name: string;
	role: string;
	teacher_id: number | string;
	period: number | string;
	periods: number | string;
};
export const INIT_USERINPUT_REGISTER: T_USERINPUT_REGISTER = {
	username: "",
	password: "",
	confirm_password: "",
	first_name: "",
	last_name: "",
	role: "",
	teacher_id: "",
	period: "",
	periods: "",
};

export enum E_REGISTER_RESULT {
	NULL = -1,
	USERNAME_EXISTS,
	VALID,
}
export type T_APIRESULT_REGISTER = {
	result: E_REGISTER_RESULT;
	tokens: T_TOKENS;
};
export const INIT_APIRESULT_REGISTER: T_APIRESULT_REGISTER = {
	result: E_REGISTER_RESULT.NULL,
	tokens: deepCopyObject(INIT_TOKENS),
};

// LOGIN
export type T_USERINPUT_LOGIN = {
	username: string;
	password: string;
};
export const INIT_USERINPUT_LOGIN: T_USERINPUT_LOGIN = {
	username: "",
	password: "",
};

export type T_APIRESULT_LOGIN = {
	valid: boolean;
	tokens: T_TOKENS;
};
export const INIT_APIRESULT_LOGIN: T_APIRESULT_LOGIN = {
	valid: false,
	tokens: deepCopyObject(INIT_TOKENS),
};

// VALIDATE
export type T_APIRESULT_VALIDATE_ACCESS_TOKEN = {
	valid: boolean;
	user_data: T_USERDATA;
};

// ALL API_RESULTS
export type T_APIRESULTS =
	| T_APIRESULT_LOGIN
	| T_APIRESULT_REGISTER
	| T_APIRESULT_VALIDATE_ACCESS_TOKEN;
