import { T_TOKENS } from "../../../types";
import generateAuthTokenStr from "../../generateAuthTokenStr";
import route_prefix from "../../route_prefix";

const url = route_prefix("/user/vertical");

export type T_PARAMS = {
	tokens: T_TOKENS;
	vertical: boolean;
};

async function UPDATE_VERTICAL_PREF(params: T_PARAMS): Promise<Response> {
	const res = await fetch(url, {
		method: "PUT",
		headers: {
			Authorization: generateAuthTokenStr(params.tokens.access_token),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ vertical: params.vertical }),
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	return res;
}

export default UPDATE_VERTICAL_PREF;
