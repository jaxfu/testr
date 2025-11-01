import { useState } from "react";
import styles from "./Info.module.scss";
import { E_MODES } from "./Locals";
import { type T_STUDENT_DATA } from "../../../../../../types/users";
import { type T_CLASS } from "../../../../../../types/teacherData";
import ChangeClass from "./children/ChangeClass/ChangeClass";
import Confirm from "./children/Confirm/Confirm";
import EditNames from "./children/EditNames/EditNames";
import Buttons from "./children/Buttons/Buttons";
import EditedStudentInfoProvider from "./EditedStudentInfoProvider";

interface IProps {
	student: T_STUDENT_DATA;
	cl: T_CLASS;
	classes: T_CLASS[];
}

const Info: React.FC<IProps> = (props) => {
	const [mode, setMode] = useState<E_MODES>(E_MODES.DISPLAY);

	return (
		<EditedStudentInfoProvider
			init={{
				first_name: props.student.first_name,
				last_name: props.student.last_name,
				username: props.student.username,
				class_id: props.student.class_id,
				user_id: props.student.user_id,
			}}
		>
			<section className={styles.root}>
				<EditNames mode={mode} student={props.student} />

				<ChangeClass cl={props.cl} classes={props.classes} mode={mode} />

				<Buttons mode={{ curr: mode, set: setMode }} />
			</section>

			{mode === E_MODES.CONFIRM_DELETE && (
				<Confirm
					cl={props.cl}
					student={props.student}
					mode={{ curr: mode, set: setMode }}
				/>
			)}
		</EditedStudentInfoProvider>
	);
};

export default Info;
