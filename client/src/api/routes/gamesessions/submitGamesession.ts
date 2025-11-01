import { T_TOKENS } from "../../../types";
import { T_GAME_SESSION } from "../../../types/game";
import generateAuthTokenStr from "../../generateAuthTokenStr";
import route_prefix from "../../route_prefix";

const url = route_prefix("/user/gamesessions");

export type T_PARAMS = {
	tokens: T_TOKENS;
	session: T_GAME_SESSION;
};

async function SUBMIT_GAME_SESSION(params: T_PARAMS): Promise<Response> {
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: generateAuthTokenStr(params.tokens.access_token),
		},
		body: JSON.stringify(params.session),
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	return res;
}

export default SUBMIT_GAME_SESSION;
