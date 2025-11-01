import type { T_TOKENS } from "../../../types";
import route_prefix from "../../route_prefix";

const url = route_prefix("/login");

export type T_PARAMS = {
	username: string;
	password: string;
};

export type T_RES = {
	valid: boolean;
	tokens: T_TOKENS;
};

async function LOGIN(params: T_PARAMS): Promise<T_RES> {
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(params),
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	const data: T_RES = await res.json();
	return data;
}

export default LOGIN;
