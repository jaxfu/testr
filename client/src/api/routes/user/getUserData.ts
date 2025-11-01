import route_prefix from "../../route_prefix";
import { T_USERDATA } from "../../../types";
import generateAuthTokenStr from "../../generateAuthTokenStr";
import { T_AUTH } from "../../../contexts/AuthProvider";

const url = route_prefix("/user");

export type T_PARAMS = T_AUTH;

export type T_RES = {
	user_data: T_USERDATA;
};

async function GET_USER_DATA(params: T_PARAMS): Promise<T_RES> {
	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: generateAuthTokenStr(params.tokens.curr.access_token),
		},
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	const data: T_RES = await res.json();
	return data;
}

export default GET_USER_DATA;
