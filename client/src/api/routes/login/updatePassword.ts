import { T_TOKENS } from "../../../types";
import route_prefix from "../../route_prefix";

const url = route_prefix("/password");

export type T_PARAMS = {
	password: string;
	code: string;
};

export type T_RES = T_TOKENS;

async function UPDATE_PASSWORD(params: T_PARAMS): Promise<T_RES> {
	const res = await fetch(url, {
		method: "PUT",
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

export default UPDATE_PASSWORD;
