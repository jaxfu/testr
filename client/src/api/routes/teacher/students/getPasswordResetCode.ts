import { T_TOKENS } from "../../../../types";
import generateAuthTokenStr from "../../../generateAuthTokenStr";
import route_prefix from "../../../route_prefix";

const url = route_prefix("/password/reset");

export type T_PARAMS = {
	tokens: T_TOKENS;
	id: number;
};

export type T_RES = {
	code: string;
};

async function GET_PASSWORD_RESET_CODE(params: T_PARAMS): Promise<T_RES> {
	const res = await fetch(`${url}/${params.id.toString()}`, {
		method: "GET",
		headers: {
			Authorization: generateAuthTokenStr(params.tokens.access_token),
		},
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	const data = await res.json();
	return data;
}

export default GET_PASSWORD_RESET_CODE;
