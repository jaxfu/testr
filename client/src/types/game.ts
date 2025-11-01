export type T_OPERATIONS = {
	add: boolean;
	sub: boolean;
	mult: boolean;
	div: boolean;
};
export enum E_OPERATIONS {
	NULL = -1,
	ADD,
	SUB,
	MULT,
	DIV,
}

export enum E_GAME_LIMIT_TYPES {
	NULL = -1,
	TIME,
	COUNT,
}

export type T_GAME_SETTINGS = {
	limit_type: E_GAME_LIMIT_TYPES;
	limit_amount: number;
	min: number;
	max: number;
	add: boolean;
	sub: boolean;
	mult: boolean;
	div: boolean;
};
export const INIT_GAME_SETTINGS: T_GAME_SETTINGS = {
	min: 0,
	max: 0,
	add: false,
	sub: false,
	mult: true,
	div: false,
	limit_type: E_GAME_LIMIT_TYPES.NULL,
	limit_amount: 0,
};

export type T_GAME_SESSION = {
	questions_count: number;
	correct_count: number;
	score: number;
	time: number;
	timestamp: number;
} & T_GAME_SETTINGS;

export enum E_GAME_STATUS {
	PRE = 0,
	ACTIVE,
	POST,
}
