import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, USER_ROLES } from "../../../../../../utils/consts";
import { clearTokensFromLocalStorage } from "../../../../../../utils/methods";
import { useAuthCtx } from "../../../../../../contexts/AuthProvider";
import useUserDataQuery from "../../../../../../queries/userDataQuery";

const NavBar: React.FC = () => {
	const authData = useAuthCtx();
	const { isSuccess, data } = useUserDataQuery(authData);

	const queryClient = useQueryClient();

	const location = useLocation();
	const navigate = useNavigate();

	return (
		<nav className={styles.root}>
			<div className={styles.scroll}>
				{isSuccess && data && (
					<Link to={"/"} className={`${styles.link} ${styles.name}`}>
						<h3 className={location.pathname === "/" ? styles.current : ""}>
							Home
						</h3>
					</Link>
				)}

				<Link to={"/game"} className={styles.link}>
					<h3 className={location.pathname === "/game" ? styles.current : ""}>
						Play
					</h3>
				</Link>

				<Link to={"/assignments"} className={styles.link}>
					<h3
						className={
							location.pathname === "/assignments" ? styles.current : ""
						}
					>
						Assignments
					</h3>
				</Link>

				<Link to={"/stats"} className={styles.link}>
					<h3 className={location.pathname === "/stats" ? styles.current : ""}>
						Stats
					</h3>
				</Link>

				{isSuccess && data.user_data.role === USER_ROLES.TEACHER && (
					<Link to={"/teacher/classes"} className={styles.link}>
						<h3
							className={
								location.pathname === "/teacher/classes" ? styles.current : ""
							}
						>
							Classes
						</h3>
					</Link>
				)}

				<Link to={"/settings"} className={styles.link}>
					<h3
						className={location.pathname === "/settings" ? styles.current : ""}
					>
						Settings
					</h3>
				</Link>

				<div className={styles.link}>
					<h3
						onClick={() => {
							clearTokensFromLocalStorage();
							authData.tokens.set(undefined);
							queryClient.invalidateQueries({
								queryKey: [QUERY_KEYS.USER_DATA],
							});
							navigate("/login");
						}}
					>
						Logout
					</h3>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
