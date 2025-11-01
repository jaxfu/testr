import { T_TOKENS } from "../../../../types";
import { T_GAME_SESSION } from "../../../../types/game";
import generateAuthTokenStr from "../../../generateAuthTokenStr";
import route_prefix from "../../../route_prefix";

const url = route_prefix("/teacher/student");

export type T_PARAMS = {
	tokens: T_TOKENS;
	id: number;
};

export type T_RES = T_GAME_SESSION[];

async function GET_STUDENT_DATA(params: T_PARAMS): Promise<T_RES> {
	const res = await fetch(`${url}/${params.id.toString()}`, {
		method: "GET",
		headers: {
			Authorization: generateAuthTokenStr(params.tokens.access_token),
		},
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	const data: T_RES = await res.json();
	return data;
}

export default GET_STUDENT_DATA;
