import styles from "./Classes.module.scss";
import Loading from "../../../Loading/Loading";
import useTeacherDataQuery from "../../../../queries/teacherDataQuery";
import { useAuthCtx } from "../../../../contexts/AuthProvider";
import AddClass from "./children/AddClass/AddClass";
import { Link } from "react-router-dom";

const Classes: React.FC = () => {
	const auth = useAuthCtx();
	const classesDataQuery = useTeacherDataQuery(auth.tokens.curr, auth.valid);

	if (classesDataQuery.isSuccess && classesDataQuery.data) {
		return (
			<div className={styles.root}>
				<div className={styles.scroll}>
					<div className={`${styles.row} ${styles.headers}`}>
						<div className={styles.classes}>
							<h3>My Classes</h3>
						</div>

						<div className={styles.students}>
							<h3>Students</h3>
						</div>
					</div>

					{classesDataQuery.data.classes.length > 0 ? (
						classesDataQuery.data.classes.map((c) => {
							return (
								<Link
									to={`/teacher/class/${c.class_id}`}
									key={`class-${c.class_id}`}
									className="link"
								>
									<div className={styles.row}>
										<div className={styles.classes}>{c.name}</div>

										<div className={styles.students}>{c.population}</div>
									</div>
								</Link>
							);
						})
					) : (
						<div>No classes</div>
					)}

					<div className={styles.add}>
						<AddClass />
					</div>
				</div>
			</div>
		);
	} else if (classesDataQuery.isFetching) {
		return <Loading />;
	} else return <div>Error, please refresh</div>;
};

export default Classes;
