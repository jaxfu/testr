export type T_ASSIGNMENT = {
	name: string;
	classes: number[];
	limit_type: number;
	limit_amount: number;
	due: number;
	min: number;
	max: number;
	add: boolean;
	sub: boolean;
	mult: boolean;
	div: boolean;
	is_active?: boolean;
};
export const INIT_ASSIGNMENT: T_ASSIGNMENT = {
	name: "",
	classes: [],
	limit_type: -1,
	limit_amount: -1,
	due: -1,
	min: -1,
	max: -1,
	add: false,
	sub: false,
	mult: false,
	div: false,
};
