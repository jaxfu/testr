import { T_TOKENS } from "../../../../types";
import { T_CLASS } from "../../../../types/teacherData";
import generateAuthTokenStr from "../../../generateAuthTokenStr";
import route_prefix from "../../../route_prefix";

const url = route_prefix("/classes");

export type T_PARAMS = {
	cl: T_CLASS;
	tokens: T_TOKENS;
};

async function ADD_CLASS(params: T_PARAMS): Promise<Response> {
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: generateAuthTokenStr(params.tokens.access_token),
		},
		body: JSON.stringify(params.cl),
	});

	if (!res.ok) {
		throw new Error();
	}

	return res;
}

export default ADD_CLASS;
