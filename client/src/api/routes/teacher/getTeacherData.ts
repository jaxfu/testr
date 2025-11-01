import route_prefix from "../../route_prefix";
import { T_TOKENS } from "../../../types";
import generateAuthTokenStr from "../../generateAuthTokenStr";
import { T_CLASS, T_TEACHER_DATA } from "../../../types/teacherData";
import { T_STUDENT_DATA } from "../../../types/users";

const url = route_prefix("/teacher/get");

export type T_PARAMS = T_TOKENS;

export type T_RES = {
	classes: T_CLASS[];
	students: T_STUDENT_DATA[];
	teacher_data: T_TEACHER_DATA;
};

async function GET_TEACHER_DATA(params: T_PARAMS): Promise<T_RES> {
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

export default GET_TEACHER_DATA;
