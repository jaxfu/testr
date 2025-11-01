import { T_CLASS } from "../../../types/teacherData";
import route_prefix from "../../route_prefix";

const url = route_prefix("/teacher/get");

export type T_PARAMS = {
	id: number;
};

export type T_RES = {
	first_name: string;
	last_name: string;
	school: string;
	classes: T_CLASS[];
	valid: boolean;
};

async function GET_TEACHER_INFO_FOR_STUDENT_REGISTER(
	params: T_PARAMS,
): Promise<T_RES> {
	const res = await fetch(`${url}/${params.id}`, {
		method: "GET",
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	const data: T_RES = await res.json();
	return data;
}

export default GET_TEACHER_INFO_FOR_STUDENT_REGISTER;
