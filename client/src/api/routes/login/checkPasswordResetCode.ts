import { T_USERDATA } from "../../../types";
import route_prefix from "../../route_prefix";

const url = route_prefix("/password/reset/code");

export type T_PARAMS = {
	username: string;
	code: string;
};

export type T_RES = T_USERDATA;

async function CHECK_PASSWORD_RESET_CODE(params: T_PARAMS): Promise<T_RES> {
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

export default CHECK_PASSWORD_RESET_CODE;
