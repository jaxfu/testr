import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.scss";
import useUserDataQuery from "../../../../queries/userDataQuery";
import { useAuthCtx } from "../../../../contexts/AuthProvider";
import { USER_ROLES } from "../../../../utils/consts";
import { IoMdSettings } from "react-icons/io";

const NavBar: React.FC = () => {
	const authData = useAuthCtx();
	const { isSuccess, data } = useUserDataQuery(authData);
	const location = useLocation();

	return (
		<nav className={styles.root}>
			<div className={styles.top}>
				<Link to={"/"} className={styles.link}>
					<div className={location.pathname === "/" ? styles.current : ""}>
						Home
					</div>
				</Link>

				<Link to={"/game"} className={styles.link}>
					<div className={location.pathname === "/game" ? styles.current : ""}>
						Play
					</div>
				</Link>

				<Link to={"/assignments"} className={styles.link}>
					<div
						className={
							location.pathname === "/assignments" ? styles.current : ""
						}
					>
						Assignments
					</div>
				</Link>

				<Link to={"/stats"} className={styles.link}>
					<div className={location.pathname === "/stats" ? styles.current : ""}>
						Stats
					</div>
				</Link>

				{isSuccess && data.user_data.role === USER_ROLES.TEACHER && (
					<Link to={"/teacher/classes"} className={styles.link}>
						<div
							className={
								location.pathname === "/teacher/classes" ? styles.current : ""
							}
						>
							Classes
						</div>
					</Link>
				)}
			</div>

			{isSuccess && data && (
				<div className={styles.bottom}>
					<div className={styles.link}>
						<div id={styles.username}>
							<span>{data.user_data.username}</span>
							<Link to={"/settings"}>
								<IoMdSettings />
							</Link>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
};

export default NavBar;
