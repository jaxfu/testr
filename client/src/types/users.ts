export type T_STUDENT_DATA = {
	first_name: string;
	last_name: string;
	username: string;
	user_id: number;
	teacher_id: number;
	class_id: number;
};
export const INIT_STUDENT_DATA: T_STUDENT_DATA = {
	first_name: "",
	last_name: "",
	username: "",
	user_id: -1,
	teacher_id: -1,
	class_id: -1,
};
