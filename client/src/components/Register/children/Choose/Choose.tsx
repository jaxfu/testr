import styles from "./Choose.module.scss";
import { Link } from "react-router-dom";

const Choose: React.FC = () => {
	return (
		<div className={styles.root}>
			<Link className={styles.link} to={"/register/student"}>
				<div>Student</div>
			</Link>
			<Link className={styles.link} to={"/register/teacher"}>
				<div>Teacher</div>
			</Link>
		</div>
	);
};

export default Choose;
