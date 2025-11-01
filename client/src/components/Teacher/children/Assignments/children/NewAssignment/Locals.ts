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
		time: number | string;
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
			mult: false,
			div: false,
		},
		limits: {
			time: "",
			count: "",
		},
	} as T_SETTINGS_FORM,
	endOfDayTimestamp(date: Date): number {
		// Set hours, minutes, seconds, and milliseconds to represent 11:59:59 PM
		date.setHours(23, 59, 59, 999);

		// Convert the date to a Unix timestamp in milliseconds, then divide by 1000 to get seconds
		return Math.floor(date.getTime() / 1000);
	},
};

export default Locals;
