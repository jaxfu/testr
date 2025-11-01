import { useParams } from "react-router-dom";
import { useAuthCtx } from "../../../../contexts/AuthProvider";
import useTeacherDataQuery from "../../../../queries/teacherDataQuery";
import styles from "./Student.module.scss";
import Loading from "../../../Loading/Loading";
import useStudentDataQuery from "../../../../queries/studentData";
import PastTests from "../../../Home/children/PastTests/PastTests";
import { T_CLASS } from "../../../../types/teacherData";
import Info from "./children/Info/Info";

const Student: React.FC = () => {
	const auth = useAuthCtx();
	const teacherDataQuery = useTeacherDataQuery(auth.tokens.curr, auth.valid);

	const { id: idStr } = useParams<{ id: string }>();
	let id: number = 0;
	if (idStr !== undefined) {
		id = Number.parseInt(idStr);
	}
	const studentDataQuery = useStudentDataQuery(
		{
			tokens: auth.tokens.curr,
			id,
		},
		teacherDataQuery.isSuccess,
	);

	if (teacherDataQuery.isFetching) {
		return <Loading />;
	} else if (
		teacherDataQuery.isSuccess &&
		teacherDataQuery.data !== undefined
	) {
		const student = teacherDataQuery.data.students.find(
			(s) => s.user_id.toString() === idStr,
		);

		if (student !== undefined) {
			const cl = teacherDataQuery.data.classes.find(
				(c) => c.class_id === student.class_id,
			) as T_CLASS;

			return (
				<div className={styles.root}>
					<Info
						student={student}
						cl={cl}
						classes={teacherDataQuery.data.classes}
					/>

					{studentDataQuery.isSuccess && studentDataQuery.data.length > 0 ? (
						<PastTests sessions={studentDataQuery.data} />
					) : (
						<div>No past tests</div>
					)}
				</div>
			);
		} else alert("error, please refresh");
	} else alert("error, please refresh");
};

export default Student;
