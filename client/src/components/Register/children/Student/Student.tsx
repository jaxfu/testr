import { useState } from "react";
import { deepCopyObject } from "../../../../utils/methods";
import {
	INIT_FORM_REGISTER_STUDENT,
	T_FORM_REGISTER_STUDENT,
} from "../../Register";
import UserForm from "./children/UserForm/UserForm";
import TeacherForm from "./children/TeacherForm/TeacherForm";

const Student: React.FC = () => {
	const [teacherMode, setTeacherMode] = useState<boolean>(false);
	const [formData, setFormData] = useState<T_FORM_REGISTER_STUDENT>(
		deepCopyObject(INIT_FORM_REGISTER_STUDENT),
	);

	if (teacherMode) {
		return (
			<TeacherForm
				formData={{ curr: formData, set: setFormData }}
				teacherMode={{ curr: teacherMode, set: setTeacherMode }}
			/>
		);
	} else {
		return (
			<UserForm
				formData={{ curr: formData, set: setFormData }}
				teacherMode={{ curr: teacherMode, set: setTeacherMode }}
			/>
		);
	}
};

export default Student;
