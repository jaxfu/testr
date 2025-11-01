import { E_GAME_LIMIT_TYPES } from "../../../../types/game";

export type T_SETTINGS_FORM = {
	range: {
		min: number | string;
		max: number | string;
	};
	ops: {
		add: boolean;
		sub: boolean;
		mult: boolean;
		div: boolean;
	};
	limits: {
		type: E_GAME_LIMIT_TYPES;
		count: number | string;
	};
};

const Locals = {
	INIT_SETTINGS_FORM: {
		range: {
			min: "",
			max: "",
		},
		ops: {
			add: false,
			sub: false,
			mult: true,
			div: false,
		},
		limits: {
			type: E_GAME_LIMIT_TYPES.TIME,
			count: "",
		},
	} as T_SETTINGS_FORM,
};

export default Locals;
