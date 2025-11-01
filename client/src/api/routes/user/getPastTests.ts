import { T_TOKENS } from "../../../types";
import { T_GAME_SESSION } from "../../../types/game";
import route_prefix from "../../route_prefix";
import generateAuthTokenStr from "../../generateAuthTokenStr";

const url = route_prefix("/user/gamesessions");

export type T_PARAMS = T_TOKENS;

export type T_RES = T_GAME_SESSION[];

async function GET_PAST_TESTS(params: T_PARAMS): Promise<T_RES> {
	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: generateAuthTokenStr(params.access_token),
		},
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	const data: T_RES = await res.json();
	return data;
}

export default GET_PAST_TESTS;
