const url = route_prefix("/teacher/student/0");
import { T_EDITED_STUDENT_INFO } from "../../../../components/Teacher/children/Student/children/Info/EditedStudentInfoProvider";
import { T_TOKENS } from "../../../../types";
import generateAuthTokenStr from "../../../generateAuthTokenStr";
import route_prefix from "../../../route_prefix";

export type T_PARAMS = {
	tokens: T_TOKENS;
	info: T_EDITED_STUDENT_INFO;
};

async function UPDATE_STUDENT_DATA(params: T_PARAMS): Promise<Response> {
	const res = await fetch(url, {
		method: "PUT",
		headers: {
			Authorization: generateAuthTokenStr(params.tokens.access_token),
			"Content-Type": "application/json",
		},
		body: JSON.stringify(params.info),
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	return res;
}

export default UPDATE_STUDENT_DATA;
