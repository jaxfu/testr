import { T_TOKENS } from "../../../../types";
import generateAuthTokenStr from "../../../generateAuthTokenStr";
import route_prefix from "../../../route_prefix";

const url = route_prefix("/teacher/student");

export type T_PARAMS = {
	tokens: T_TOKENS;
	id: number;
};

async function DELETE_STUDENT(params: T_PARAMS): Promise<Response> {
	const res: Response = await fetch(`${url}/${params.id.toString()}`, {
		method: "DELETE",
		headers: {
			Authorization: generateAuthTokenStr(params.tokens.access_token),
		},
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	return res;
}

export default DELETE_STUDENT;
