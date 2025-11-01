import { Link, useParams } from "react-router-dom";
import { useAuthCtx } from "../../../../../../contexts/AuthProvider";
import useTeacherDataQuery from "../../../../../../queries/teacherDataQuery";
import styles from "./Class.module.scss";
import Loading from "../../../../../Loading/Loading";
import { T_STUDENT_DATA } from "../../../../../../types/users";

const Class: React.FC = () => {
	const auth = useAuthCtx();
	const teacherData = useTeacherDataQuery(auth.tokens.curr, auth.valid);

	const { id } = useParams<{ id: string }>();

	if (teacherData.isSuccess && teacherData.data !== undefined) {
		const students: T_STUDENT_DATA[] = teacherData.data.students
			.filter((s) => s.class_id.toString() === id)
			.sort((a, b) => a.last_name.localeCompare(b.last_name));
		const cl = teacherData.data.classes.find(
			(c) => c.class_id.toString() === id,
		);

		return (
			<div className={styles.root}>
				<div className={styles.top}>
					<div className={styles.info}>{cl?.name}</div>
				</div>

				<div className={styles.students}>
					<div className={styles.scroll}>
						<div className={styles.row} id={styles.headers}>
							<div>
								<h3>Student</h3>
							</div>
							<div>
								<h3>Username</h3>
							</div>
						</div>

						{students.length > 0 ? (
							students.map((s) => {
								return (
									<Link
										to={`/teacher/student/${s.user_id}`}
										key={`student-${s.user_id}`}
										className="link"
									>
										<div className={styles.row}>
											<div>
												{s.last_name}, {s.first_name}
											</div>
											<div>{s.username}</div>
										</div>
									</Link>
								);
							})
						) : (
							<div className={styles.empty}>No students</div>
						)}
					</div>
				</div>
			</div>
		);
	} else return <Loading />;
};

export default Class;
